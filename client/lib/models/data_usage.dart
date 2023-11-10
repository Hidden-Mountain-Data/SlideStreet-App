class DataUsage {
  final int dataUsageId;
  final int dateId;
  final int? routerId;
  final int simId;
  final int userId;
  final String dataUsage;
  final String? createdAt;
  final String? updatedAt;
  final String? deletedAt;

  DataUsage({
    required this.dataUsageId,
    required this.dateId,
    this.routerId,
    required this.simId,
    required this.userId,
    required this.dataUsage,
    this.createdAt,
    this.updatedAt,
    this.deletedAt,
  });

  factory DataUsage.fromJson(Map<String, dynamic> json) {
    return DataUsage(
      dataUsageId: json['data_usage_id'],
      dateId: json['date_id'],
      routerId: json['router_id'],
      simId: json['sim_id'],
      userId: json['user_id'],
      dataUsage: json['data_usage'],
      createdAt: json['created_at'],
      updatedAt: json['updated_at'],
      deletedAt: json['deleted_at'],
    );
  }
}
