import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import '../models/poster_models.dart';

class PosterApiService {
  static const String baseUrl = 'https://digital-services-platform-slnw.onrender.com/api/v1';

  // 1. Fetch Categories
  static Future<List<PosterCategory>> getCategories() async {
    final response = await http.get(Uri.parse('$baseUrl/posters/categories/'));
    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(utf8.decode(response.bodyBytes));
      return data.map((json) => PosterCategory.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load categories: ${response.statusCode}');
    }
  }

  // 2. Fetch Templates
  static Future<List<PosterTemplate>> getTemplates({String? categorySlug, bool? featured, String? search}) async {
    final queryParams = <String, String>{};
    if (categorySlug != null && categorySlug.isNotEmpty) queryParams['category'] = categorySlug;
    if (featured == true) queryParams['featured'] = 'true';
    if (search != null && search.isNotEmpty) queryParams['search'] = search;

    final uri = Uri.parse('$baseUrl/posters/templates/').replace(queryParameters: queryParams);
    final response = await http.get(uri);

    if (response.statusCode == 200) {
      final List<dynamic> data = json.decode(utf8.decode(response.bodyBytes));
      return data.map((json) => PosterTemplate.fromJson(json)).toList();
    } else {
      throw Exception('Failed to load templates: ${response.statusCode}');
    }
  }

  // 3. Submit Custom Order with File Upload
  static Future<PosterOrderResponse> submitOrder({
    required String customerName,
    required String email,
    required String phone,
    required int categoryId,
    required String heading,
    required String content,
    String language = 'BOTH',
    String outputSize = 'WHATSAPP',
    String outputFormat = 'PNG',
    File? photoFile,
    File? logoFile,
    File? referenceFile,
  }) async {
    final uri = Uri.parse('$baseUrl/posters/orders/');
    final request = http.MultipartRequest('POST', uri);

    request.fields['customer_name'] = customerName;
    request.fields['email'] = email;
    request.fields['phone'] = phone;
    request.fields['customer_type'] = 'INDIVIDUAL';
    request.fields['category'] = categoryId.toString();
    request.fields['heading'] = heading;
    request.fields['content'] = content;
    request.fields['language'] = language;
    request.fields['output_size'] = outputSize;
    request.fields['output_format'] = outputFormat;
    request.fields['privacy_consent'] = 'true';

    if (photoFile != null) {
      request.files.add(await http.MultipartFile.fromPath('customer_photos', photoFile.path));
    }
    if (logoFile != null) {
      request.files.add(await http.MultipartFile.fromPath('business_logos', logoFile.path));
    }
    if (referenceFile != null) {
      request.files.add(await http.MultipartFile.fromPath('reference_images', referenceFile.path));
    }

    final streamedResponse = await request.send();
    final response = await http.Response.fromStream(streamedResponse);

    if (response.statusCode == 201) {
      final data = json.decode(utf8.decode(response.bodyBytes));
      return PosterOrderResponse.fromJson(data);
    } else {
      throw Exception('Failed to submit order: ${response.body}');
    }
  }

  // 4. Track Order Status by Reference & Email
  static Future<Map<String, dynamic>> checkOrderStatus(String reference, String email) async {
    final uri = Uri.parse('$baseUrl/posters/orders/$reference/').replace(queryParameters: {'email': email});
    final response = await http.get(uri);
    if (response.statusCode == 200) {
      return json.decode(utf8.decode(response.bodyBytes));
    } else {
      throw Exception('Order lookup failed: ${response.statusCode}');
    }
  }
}
