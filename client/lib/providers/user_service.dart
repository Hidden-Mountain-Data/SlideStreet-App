import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:client/models/user.dart';
import 'package:http/http.dart' as http;
import 'dart:io';
import 'package:provider/provider.dart';
import 'package:client/notifiers/user_notifier.dart';

const storage = FlutterSecureStorage();

class UserService {
  Future<User?> login(Map<String, dynamic> userData) async {
    final url =
        Platform.isAndroid ? 'http://10.0.2.2:3000' : 'http://localhost:3000';

    final response =
        await http.post(Uri.parse('$url/api/auth/login'), body: userData);

    if (response.statusCode == 200) {
      final user = jsonDecode(response.body);
      await storage.deleteAll();
      await storage.write(key: 'token', value: user['data']['token']);
      await storage.write(key: 'user', value: jsonEncode(user['data']));
      print(user);
      return User.fromJson(user);
    } else {
      return null;
    }
  }

  Future<void> register(Map<String, dynamic> userData) async {
    final url =
        Platform.isAndroid ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
    final response =
        await http.post(Uri.parse('$url/api/auth/register'), body: userData);

    if (response.statusCode == 201) {
      return;
    } else {
      return;
    }
  }

  void logoutUser(BuildContext context) {
    Provider.of<UserProvider>(context, listen: false).logout();
  }
}
