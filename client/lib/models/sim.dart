class Sim {
  final int simId;
  final int userId;
  final int routerId;
  final String iccid;
  final bool active;
  final String status;
  final String? createdAt;
  final String? updatedAt;
  final String? ipAddress;

  Sim({
    required this.simId,
    required this.userId,
    required this.routerId,
    required this.iccid,
    required this.active,
    required this.status,
    this.createdAt,
    this.updatedAt,
    this.ipAddress,
  });

  factory Sim.fromJson(Map<String, dynamic> json) {
    return Sim(
      simId: json['sim_id'],
      userId: json['user_id'],
      routerId: json['router_id'],
      iccid: json['iccid'],
      active: json['active'],
      status: json['status'],
      createdAt: json['created_at'],
      updatedAt: json['updated_at'],
      ipAddress: json['ip_address'],
    );
  }
}
