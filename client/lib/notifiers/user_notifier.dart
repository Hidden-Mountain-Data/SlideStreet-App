import 'package:client/models/user.dart';
import 'package:flutter/material.dart';

class UserProvider extends ChangeNotifier {
  User? _user;

  User? get user => _user;

  void setUser(User user) {
    _user = user;
    notifyListeners();
  }

  void logout() {
    _user = null;
    // Clear user data from secure storage or wherever you are storing it
    // Add necessary code to clear the token or any other sensitive information
    // ...
    notifyListeners();
  }
}
