class PosterCategory {
  final int id;
  final String name;
  final String slug;
  final String description;
  final String? image;
  final int templateCount;

  PosterCategory({
    required this.id,
    required this.name,
    required this.slug,
    required this.description,
    this.image,
    required this.templateCount,
  });

  factory PosterCategory.fromJson(Map<String, dynamic> json) {
    return PosterCategory(
      id: json['id'] ?? 0,
      name: json['name'] ?? '',
      slug: json['slug'] ?? '',
      description: json['description'] ?? '',
      image: json['image'],
      templateCount: json['template_count'] ?? 0,
    );
  }
}

class PosterTemplate {
  final int id;
  final int categoryId;
  final String categoryName;
  final String categorySlug;
  final String name;
  final String slug;
  final String description;
  final String previewImage;
  final double startingPrice;
  final List<String> supportedLanguages;
  final List<String> supportedSizes;
  final bool isFeatured;

  PosterTemplate({
    required this.id,
    required this.categoryId,
    required this.categoryName,
    required this.categorySlug,
    required this.name,
    required this.slug,
    required this.description,
    required this.previewImage,
    required this.startingPrice,
    required this.supportedLanguages,
    required this.supportedSizes,
    required this.isFeatured,
  });

  factory PosterTemplate.fromJson(Map<String, dynamic> json) {
    return PosterTemplate(
      id: json['id'] ?? 0,
      categoryId: json['category'] ?? 0,
      categoryName: json['category_name'] ?? '',
      categorySlug: json['category_slug'] ?? '',
      name: json['name'] ?? '',
      slug: json['slug'] ?? '',
      description: json['description'] ?? '',
      previewImage: json['preview_image'] ?? '',
      startingPrice: double.tryParse(json['starting_price']?.toString() ?? '99') ?? 99.0,
      supportedLanguages: List<String>.from(json['supported_languages'] ?? []),
      supportedSizes: List<String>.from(json['supported_sizes'] ?? []),
      isFeatured: json['is_featured'] ?? false,
    );
  }
}

class PosterOrderResponse {
  final bool success;
  final String message;
  final String publicReference;
  final String customerName;
  final String category;
  final String status;

  PosterOrderResponse({
    required this.success,
    required this.message,
    required this.publicReference,
    required this.customerName,
    required this.category,
    required this.status,
  });

  factory PosterOrderResponse.fromJson(Map<String, dynamic> json) {
    final order = json['order'] ?? {};
    return PosterOrderResponse(
      success: json['success'] ?? false,
      message: json['message'] ?? '',
      publicReference: order['public_reference'] ?? '',
      customerName: order['customer_name'] ?? '',
      category: order['category'] ?? '',
      status: order['status'] ?? 'NEW',
    );
  }
}
