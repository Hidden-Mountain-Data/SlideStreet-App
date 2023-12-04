import 'package:client/models/sim.dart';

class Routers {
  final int routerId;
  final int simId;
  final int userId;
  final String name;
  final String? notes;
  final String imei;
  final String? createdAt;
  final String? updatedAt;
  final String model;
  final List<Sim> sims;

  Routers({
    required this.routerId,
    required this.simId,
    required this.userId,
    required this.name,
    this.notes,
    required this.imei,
    this.createdAt,
    this.updatedAt,
    required this.model,
    required this.sims,
  });

  factory Routers.fromJson(Map<String, dynamic> json) {
    var list = json['sims'] as List;
    List<Sim> simList = list.map((i) => Sim.fromJson(i)).toList();

    return Routers(
      routerId: json['router_id'],
      simId: json['sim_id'],
      userId: json['user_id'],
      name: json['name'],
      notes: json['notes'],
      imei: json['imei'],
      model: json['model'],
      createdAt: json['created_at'],
      updatedAt: json['updated_at'],
      sims: simList,
    );
  }
}
