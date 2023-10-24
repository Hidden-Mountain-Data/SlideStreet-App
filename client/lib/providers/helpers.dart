import 'package:flutter_secure_storage/flutter_secure_storage.dart';

Future<Map<String, String>?> getAuth() async {
  const storage = FlutterSecureStorage();
  final token = await storage.read(key: "token");
  if (token!.isNotEmpty) {
    return {'Authorization': 'Bearer $token'};
  } else {
    return null;
  }
}

Future<String?> getUser() async {
  const storage = FlutterSecureStorage();
  final token = await storage.read(key: "user");
  if (token!.isNotEmpty) {
    return token;
  } else {
    return null;
  }
}
