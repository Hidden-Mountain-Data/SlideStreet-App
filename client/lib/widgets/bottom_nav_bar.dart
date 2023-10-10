import 'package:client/pages/device_list.dart';
import 'package:client/pages/settings.dart';
import 'package:client/pages/usage_page.dart';
import 'package:flutter/material.dart';

class BottomNav extends StatefulWidget {
  const BottomNav({super.key, required this.currentIndex});

  final int currentIndex;

  @override
  State<BottomNav> createState() => _BottomNavState();
}

class _BottomNavState extends State<BottomNav> {
  @override
  Widget build(BuildContext context) {
    return BottomNavigationBar(
      backgroundColor: const Color.fromARGB(255, 166, 166, 166),
      items: const <BottomNavigationBarItem>[
        BottomNavigationBarItem(
          icon: Icon(Icons.home),
          label: 'List',
          backgroundColor: Color.fromARGB(255, 187, 187, 187),
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.person),
          label: 'Usage',
          backgroundColor: Color.fromARGB(255, 187, 187, 187),
        ),
        BottomNavigationBarItem(
          icon: Icon(Icons.settings),
          label: 'Settings',
          backgroundColor: Color.fromARGB(255, 187, 187, 187),
        ),
      ],
      selectedItemColor: const Color.fromARGB(255, 195, 250, 55),
      currentIndex: widget.currentIndex,
      onTap: (value) {
        switch (value) {
          case 0:
            Navigator.of(context).push(_createRoute(0, widget.currentIndex));
            break;
          case 1:
            Navigator.of(context).push(_createRoute(1, widget.currentIndex));
            break;
          case 2:
            Navigator.of(context).push(_createRoute(2, widget.currentIndex));
        }
      },
    );
  }
}

Route _createRoute(int page, int currentIndex) {
  return PageRouteBuilder(
    pageBuilder: (context, animation, secondaryAnimation) => page == 0
        ? const DeviceListPage()
        : page == 1
            ? const UsagePage()
            : const SettingsPage(),
    transitionsBuilder: (context, animation, secondaryAnimation, child) {
      var begin = Offset.zero;
      var end = Offset.zero;
      const curve = Curves.ease;

      if (currentIndex < page) {
        begin = const Offset(1.0, 0.0);
        end = Offset.zero;
      } else if (currentIndex > page) {
        begin = const Offset(-1.0, 0.0);
        end = Offset.zero;
      } else {
        begin = Offset.zero;
        end = Offset.zero;
      }
      final tween = Tween(begin: begin, end: end);
      final curvedAnimation = CurvedAnimation(
        parent: animation,
        curve: curve,
      );
      return SlideTransition(
        position: tween.animate(curvedAnimation),
        child: child,
      );
    },
  );
}
