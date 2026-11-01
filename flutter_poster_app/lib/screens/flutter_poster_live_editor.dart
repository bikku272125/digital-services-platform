import 'dart:io';
import 'dart:typed_data';
import 'dart:ui' as ui;
import 'package:flutter/material.dart';
import 'package:flutter/rendering.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:image_picker/image_picker.dart';
import 'package:path_provider/path_provider.dart';
import 'package:share_plus/share_plus.dart';
import '../services/poster_api_service.dart';

class FlutterPosterLiveEditor extends StatefulWidget {
  final String initialTheme;
  const FlutterPosterLiveEditor({super.key, this.initialTheme = 'panchayat'});

  @override
  State<FlutterPosterLiveEditor> createState() => _FlutterPosterLiveEditorState();
}

class _FlutterPosterLiveEditorState extends State<FlutterPosterLiveEditor> {
  final GlobalKey _canvasKey = GlobalKey();
  final ImagePicker _picker = ImagePicker();

  // Canvas elements state
  String _badgeText = "ग्राम पंचायत चुनाव 2026";
  String _headingText = "कर्मठ, जुझारू एवं योग्य प्रत्याशी";
  String _subheadingText = "ग्राम सभा के सर्वांगीण विकास एवं जनसेवा हेतु";
  String _candidateName = "श्री बृजेश कुमार यादव";
  String _symbolText = "चुनाव चिन्ह: कलम-दवात";
  String _sloganText = "विकास ही संकल्प, सेवा ही धर्म";
  String _contactNumber = "+91 9161420942";
  String _footerText = "समस्त ग्रामवासी | वार्ड संख्या 12";

  Color _primaryColor = const Color(0xFFD97706); // Warm Amber
  Color _secondaryColor = const Color(0xFF7C2D12); // Deep Reddish Brown
  Color _accentColor = const Color(0xFFFEF08A); // Gold Yellow

  File? _userPhoto;
  bool _isExporting = false;

  void _applyPreset(String key) {
    setState(() {
      if (key == 'panchayat') {
        _badgeText = "ग्राम पंचायत चुनाव 2026";
        _headingText = "कर्मठ, जुझारू एवं योग्य प्रत्याशी";
        _subheadingText = "ग्राम सभा के सर्वांगीण विकास हेतु अपना अमूल्य मत दें";
        _candidateName = "श्री बृजेश कुमार यादव";
        _symbolText = "चुनाव चिन्ह: कलम-दवात";
        _sloganText = "विकास ही संकल्प, सेवा ही धर्म";
        _primaryColor = const Color(0xFFD97706);
        _secondaryColor = const Color(0xFF7C2D12);
        _accentColor = const Color(0xFFFEF08A);
      } else if (key == 'birthday') {
        _badgeText = "HAPPY BIRTHDAY";
        _headingText = "जन्मदिन की हार्दिक शुभकामनाएं";
        _subheadingText = "ईश्वर आपको सदैव स्वस्थ, दीर्घायु एवं प्रसन्न रखे";
        _candidateName = "प्रिय रोहन यादव";
        _symbolText = "15 नवम्बर 2026";
        _sloganText = "May your day be filled with joy and success!";
        _primaryColor = const Color(0xFFEC4899);
        _secondaryColor = const Color(0xFF831843);
        _accentColor = const Color(0xFFFDE047);
      } else if (key == 'business') {
        _badgeText = "GRAND OPENING • 50% OFF";
        _headingText = "भव्य शुभारंभ एवं विशेष छूट";
        _subheadingText = "उच्च गुणवत्ता एवं आकर्षक उपहार प्रत्येक खरीद पर";
        _candidateName = "यादव इलेक्ट्रॉनिक्स & होम एप्लायंसेज";
        _symbolText = "ऑफर: 1 से 10 नवम्बर तक";
        _sloganText = "आपकी संतुष्टि ही हमारा विश्वास";
        _primaryColor = const Color(0xFF2563EB);
        _secondaryColor = const Color(0xFF0F172A);
        _accentColor = const Color(0xFFFBBF24);
      } else if (key == 'festival') {
        _badgeText = "शुभ दीपावली महोत्सव";
        _headingText = "दीपावली की हार्दिक मंगलकामनाएं";
        _subheadingText = "सुख, शांति और समृद्धि आपके जीवन में सदैव बनी रहे";
        _candidateName = "बृजेश यादव एवं समस्त परिवार";
        _symbolText = "दीपोत्सव पर्व 2026";
        _sloganText = "शुभ लाभ • समृद्धि • सफलता";
        _primaryColor = const Color(0xFFEA580C);
        _secondaryColor = const Color(0xFF450A0A);
        _accentColor = const Color(0xFFFDE047);
      }
    });
  }

  Future<void> _pickPhoto() async {
    final XFile? file = await _picker.pickImage(source: ImageSource.gallery);
    if (file != null) {
      setState(() {
        _userPhoto = File(file.path);
      });
    }
  }

  // Ultra-HD Canvas Export and WhatsApp Share
  Future<void> _exportAndShare() async {
    setState(() => _isExporting = true);
    try {
      RenderRepaintBoundary boundary =
          _canvasKey.currentContext!.findRenderObject() as RenderRepaintBoundary;
      ui.Image image = await boundary.toImage(pixelRatio: 3.0); // 300 DPI equivalent
      ByteData? byteData = await image.toByteData(format: ui.ImageByteFormat.png);
      Uint8List pngBytes = byteData!.buffer.asUint8List();

      final tempDir = await getTemporaryDirectory();
      final file = await File('${tempDir.path}/poster_${DateTime.now().millisecondsSinceEpoch}.png').create();
      await file.writeAsBytes(pngBytes);

      await Share.shareXFiles([XFile(file.path)], text: 'My Custom Poster by Digital Services Studio');
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Export failed: $e')));
    } finally {
      setState(() => _isExporting = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF0F172A), // Dark slate
      appBar: AppBar(
        backgroundColor: const Color(0xFF020617),
        elevation: 0,
        title: Text(
          "Live Poster Studio",
          style: GoogleFonts.poppins(fontSize: 16, fontWeight: FontWeight.w600, color: Colors.white),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.share, color: Colors.amber),
            tooltip: "Share to WhatsApp",
            onPressed: _isExporting ? null : _exportAndShare,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [
            // Preset Buttons
            SingleChildScrollView(
              scrollDirection: Axis.horizontal,
              child: Row(
                children: [
                  _presetPill("Panchayat", 'panchayat'),
                  _presetPill("Birthday", 'birthday'),
                  _presetPill("Business", 'business'),
                  _presetPill("Festival", 'festival'),
                ],
              ),
            ),
            const SizedBox(height: 16),

            // Live WYSIWYG RepaintBoundary Canvas
            Center(
              child: RepaintBoundary(
                key: _canvasKey,
                child: Container(
                  width: double.infinity,
                  constraints: const BoxConstraints(maxWidth: 380, maxHeight: 420),
                  padding: const EdgeInsets.all(20),
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    gradient: LinearGradient(
                      colors: [_primaryColor, _secondaryColor],
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                    ),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.black.withOpacity(0.5),
                        blurRadius: 20,
                        offset: const Offset(0, 10),
                      ),
                    ],
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      // Top Badge
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 4),
                        decoration: BoxDecoration(
                          color: Colors.white.withOpacity(0.2),
                          borderRadius: BorderRadius.circular(20),
                        ),
                        child: Text(
                          _badgeText,
                          style: GoogleFonts.poppins(fontSize: 11, fontWeight: FontWeight.bold, color: Colors.white),
                        ),
                      ),

                      // Portrait Circle Photo
                      GestureDetector(
                        onTap: _pickPhoto,
                        child: Container(
                          width: 100,
                          height: 100,
                          decoration: BoxDecoration(
                            shape: BoxShape.circle,
                            border: Border.all(color: _accentColor, width: 3),
                            color: Colors.black26,
                            image: _userPhoto != null
                                ? DecorationImage(image: FileImage(_userPhoto!), fit: BoxFit.cover)
                                : const DecorationImage(
                                    image: NetworkImage(
                                      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80",
                                    ),
                                    fit: BoxFit.cover,
                                  ),
                          ),
                        ),
                      ),

                      // Candidate / Entity Name
                      Text(
                        _candidateName,
                        textAlign: TextAlign.center,
                        style: GoogleFonts.poppins(
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: _accentColor,
                        ),
                      ),

                      // Main Heading
                      Text(
                        _headingText,
                        textAlign: TextAlign.center,
                        style: GoogleFonts.poppins(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: Colors.white,
                        ),
                      ),

                      // Subheading
                      Text(
                        _subheadingText,
                        textAlign: TextAlign.center,
                        style: GoogleFonts.poppins(fontSize: 11, color: Colors.white70),
                      ),

                      // Slogan & Footer
                      Container(
                        padding: const EdgeInsets.only(top: 10),
                        decoration: BoxDecoration(
                          border: Border(top: BorderSide(color: Colors.white.withOpacity(0.2))),
                        ),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(
                              _sloganText,
                              style: GoogleFonts.poppins(fontSize: 10, fontWeight: FontWeight.bold, color: _accentColor),
                            ),
                            Text(
                              _contactNumber,
                              style: GoogleFonts.poppins(fontSize: 10, color: Colors.white),
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 24),

            // Controls: Text Editing
            Text("Edit Text (Hindi / English)", style: GoogleFonts.poppins(fontSize: 13, fontWeight: FontWeight.bold, color: Colors.white70)),
            const SizedBox(height: 8),
            _buildTextField("Name", _candidateName, (v) => setState(() => _candidateName = v)),
            _buildTextField("Heading", _headingText, (v) => setState(() => _headingText = v)),
            _buildTextField("Subheading", _subheadingText, (v) => setState(() => _subheadingText = v)),
            _buildTextField("Badge", _badgeText, (v) => setState(() => _badgeText = v)),
            _buildTextField("Phone", _contactNumber, (v) => setState(() => _contactNumber = v)),

            const SizedBox(height: 16),
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF4F46E5), // Indigo
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: _pickPhoto,
              icon: const Icon(Icons.photo_camera, color: Colors.white),
              label: Text("Change Portrait Photo", style: GoogleFonts.poppins(fontWeight: FontWeight.bold, color: Colors.white)),
            ),
            const SizedBox(height: 12),
            ElevatedButton.icon(
              style: ElevatedButton.styleFrom(
                backgroundColor: const Color(0xFF10B981), // Emerald
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              onPressed: _isExporting ? null : _exportAndShare,
              icon: const Icon(Icons.download, color: Colors.white),
              label: Text(_isExporting ? "Rendering HD..." : "Export & Share HD Poster", style: GoogleFonts.poppins(fontWeight: FontWeight.bold, color: Colors.white)),
            ),
          ],
        ),
      ),
    );
  }

  Widget _presetPill(String title, String key) {
    return Padding(
      padding: const EdgeInsets.only(right: 8),
      child: ActionChip(
        backgroundColor: const Color(0xFF1E293B),
        label: Text(title, style: GoogleFonts.poppins(fontSize: 12, color: Colors.white)),
        onPressed: () => _applyPreset(key),
      ),
    );
  }

  Widget _buildTextField(String label, String value, Function(String) onChanged) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 8),
      child: TextFormField(
        initialValue: value,
        onChanged: onChanged,
        style: GoogleFonts.poppins(fontSize: 12, color: Colors.white),
        decoration: InputDecoration(
          labelText: label,
          labelStyle: GoogleFonts.poppins(fontSize: 12, color: Colors.white54),
          filled: true,
          fillColor: const Color(0xFF1E293B),
          contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
          border: OutlineInputBorder(borderRadius: BorderRadius.circular(10), borderSide: BorderSide.none),
        ),
      ),
    );
  }
}
