import 'package:flutter/material.dart';

class TopAppBar extends StatefulWidget {
  const TopAppBar({super.key, required this.title});

  final String title;

  @override
  State<TopAppBar> createState() => _TopAppBarState();
}

class _TopAppBarState extends State<TopAppBar> {
  @override
  Widget build(BuildContext context) {
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
            style: const TextStyle(
              fontSize: 32,
              fontWeight: FontWeight.w900,
              color: Color.fromARGB(255, 0, 0, 0),
            ),
          ),
          const IconButton(
            icon: Icon(Icons.person_outline_rounded,
                size: 40, color: Colors.black),
            onPressed: null,
          ),
        ],
      ),
    );
  }
}
