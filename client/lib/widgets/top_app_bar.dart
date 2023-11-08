import 'package:client/pages/profile.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:client/notifiers/theme_notifier.dart';

class TopAppBar extends StatefulWidget {
  const TopAppBar({super.key, required this.title});

  final String title;

  @override
  State<TopAppBar> createState() => _TopAppBarState();
}

class _TopAppBarState extends State<TopAppBar> {
  @override
  Widget build(BuildContext context) {
    return Consumer<ThemeNotifier>(builder: (context, themeNotifier, child) {
      return AppBar(
        automaticallyImplyLeading: false,
        leading: null,
        toolbarHeight: 75,
        centerTitle: true,
        title: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          crossAxisAlignment: CrossAxisAlignment.center,
          children: [
            Image.asset(
              'assets/Original.png',
              height: 50,
            ),
            Text(
              widget.title,
              style: TextStyle(
                  fontSize: 32,
                  fontWeight: FontWeight.bold,
                  color:
                      themeNotifier.isDarkMode ? Colors.white : Colors.black),
            ),
            IconButton(
              icon: Icon(Icons.person_outline_rounded,
                  size: 40,
                  color:
                      themeNotifier.isDarkMode ? Colors.white : Colors.black),
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(builder: (context) => const ProfilePage()),
                );
              },
            ),
          ],
        ),
      );
    });
  }
}
