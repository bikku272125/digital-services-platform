import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'screens/flutter_poster_live_editor.dart';

void main() {
  runApp(const PosterStudioApp());
}

class PosterStudioApp extends StatelessWidget {
  const PosterStudioApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Poster Design Studio',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        brightness: Brightness.dark,
        scaffoldBackgroundColor: const Color(0xFF0F172A),
        primarySwatch: Colors.indigo,
        textTheme: GoogleFonts.poppinsTextTheme(ThemeData.dark().textTheme),
      ),
      home: const FlutterPosterLiveEditor(),
    );
  }
}
