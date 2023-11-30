import 'dart:async';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class Debouncer {
  int? milliseconds;
  VoidCallback? action;
  Timer? timer;

  run(VoidCallback action) {
    if (null != timer) {
      timer!.cancel();
    }
    timer = Timer(
      const Duration(milliseconds: Duration.millisecondsPerSecond),
      action,
    );
  }
}

class RouterSearchBar extends StatefulWidget {
  final TextEditingController searchController;
  final Function(String) onSearchTextChanged;

  const RouterSearchBar({
    Key? key,
    required this.searchController,
    required this.onSearchTextChanged,
  }) : super(key: key);

  @override
  State<RouterSearchBar> createState() => _RouterSearchBarState();
}

class _RouterSearchBarState extends State<RouterSearchBar> {
  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16.0),
      child: Container(
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(10.0),
        ),
        child: TextField(
          controller: widget.searchController,
          textInputAction: TextInputAction.search,
          style: GoogleFonts.montserrat(color: Colors.black),
          decoration: const InputDecoration(
            labelText: 'Search by Router Name',
            prefixIcon: Icon(Icons.search, color: Colors.black),
            border: InputBorder.none,
            contentPadding: EdgeInsets.all(16.0),
          ),
          onChanged: widget.onSearchTextChanged,
        ),
      ),
    );
  }
}
