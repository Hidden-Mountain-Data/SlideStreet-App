import 'package:client/pages/sign_in.dart';
import 'package:flutter/material.dart';

var kColorScheme = ColorScheme.fromSeed(
    brightness: Brightness.light,
    seedColor: const Color.fromARGB(255, 187, 187, 187));

void main() {
  runApp(
    MaterialApp(
      darkTheme: ThemeData.dark().copyWith(
        useMaterial3: true,
        colorScheme: kColorScheme,
        appBarTheme: const AppBarTheme().copyWith(
          backgroundColor: const Color(0x00bbbbbb),
          foregroundColor: kColorScheme.onPrimaryContainer,
        ),
        cardTheme: const CardTheme().copyWith(
            color: const Color.fromARGB(255, 195, 195, 195),
            margin: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            shadowColor: const Color.fromARGB(0, 0, 0, 0),
            shape: const RoundedRectangleBorder(
              side: BorderSide(
                color: Color.fromARGB(255, 205, 205, 205),
                width: 2,
              ),
              borderRadius: BorderRadius.all(Radius.circular(15)),
            )),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            side: const BorderSide(
              color: Color.fromARGB(255, 205, 205, 205),
              width: 2,
            ),
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(0),
            ),
            minimumSize: const Size(double.infinity, 70),
            backgroundColor: const Color.fromARGB(255, 192, 192, 192),
            foregroundColor: const Color.fromARGB(255, 0, 0, 0),
          ),
        ),
        textTheme: ThemeData().textTheme.copyWith(
              titleLarge: const TextStyle(
                fontFamily: 'OpenSauceOne',
                fontSize: 24,
                fontWeight: FontWeight.bold,
                color: Color.fromARGB(255, 0, 0, 0),
              ),
              bodyMedium: const TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.normal,
                color: Color.fromARGB(255, 0, 0, 0),
              ),
            ),
      ),
      themeMode: ThemeMode.dark,
      home: const LoginPage(),
    ),
  );
}
