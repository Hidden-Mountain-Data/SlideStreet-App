import 'package:client/notifiers/user_notifier.dart';
import 'package:client/pages/splash_screen.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:client/notifiers/theme_notifier.dart';

var kColorScheme = ColorScheme.fromSeed(
    brightness: Brightness.light,
    seedColor: const Color.fromARGB(255, 187, 187, 187));

var kDarkColorScheme = ColorScheme.fromSeed(
    brightness: Brightness.light,
    seedColor: const Color.fromARGB(255, 187, 187, 187));

void main() {
  runApp(
    ChangeNotifierProvider(
      create: (context) => UserProvider(),
      child: ChangeNotifierProvider(
        create: (context) => ThemeNotifier(),
        child: const SlideStreet(),
      ),
    ),
  );
}

class SlideStreet extends StatelessWidget {
  const SlideStreet({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      home: Consumer<ThemeNotifier>(
        builder: (context, themeNotifier, child) {
          return MaterialApp(
            theme: ThemeData.light().copyWith(
              useMaterial3: true,
              colorScheme: kColorScheme,
              appBarTheme: const AppBarTheme().copyWith(
                backgroundColor: const Color.fromARGB(255, 187, 187, 187),
                foregroundColor: kColorScheme.onPrimaryContainer,
              ),
              bottomNavigationBarTheme: const BottomNavigationBarThemeData()
                  .copyWith(
                      backgroundColor:
                          const Color.fromARGB(255, 166, 166, 166)),
              cardTheme: const CardTheme().copyWith(
                  color: const Color.fromARGB(255, 195, 195, 195),
                  margin:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
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
            darkTheme: ThemeData.dark().copyWith(
              useMaterial3: true,
              colorScheme: kColorScheme,
              appBarTheme: const AppBarTheme().copyWith(
                backgroundColor: const Color.fromARGB(255, 37, 37, 38),
                foregroundColor: kColorScheme.onPrimaryContainer,
              ),
              bottomNavigationBarTheme: const BottomNavigationBarThemeData()
                  .copyWith(
                      backgroundColor: const Color.fromARGB(255, 37, 37, 38)),
              cardTheme: const CardTheme().copyWith(
                  color: const Color.fromARGB(255, 60, 60, 61),
                  margin:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
                  shape: const RoundedRectangleBorder(
                    side: BorderSide(
                      color: Color.fromARGB(255, 74, 74, 74),
                      width: 1,
                    ),
                    borderRadius: BorderRadius.all(Radius.circular(15)),
                  )),
              elevatedButtonTheme: ElevatedButtonThemeData(
                style: ElevatedButton.styleFrom(
                  side: const BorderSide(
                    color: Color.fromARGB(255, 82, 82, 82),
                    width: 2,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(0),
                  ),
                  minimumSize: const Size(double.infinity, 70),
                  backgroundColor: const Color.fromARGB(255, 46, 46, 46),
                  foregroundColor: const Color.fromARGB(255, 255, 255, 255),
                ),
              ),
              textTheme: ThemeData().textTheme.copyWith(
                    titleLarge: const TextStyle(
                      fontFamily: 'OpenSauceOne',
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Color.fromARGB(255, 255, 255, 255),
                    ),
                    bodyMedium: const TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.normal,
                      color: Color.fromARGB(255, 255, 255, 255),
                    ),
                  ),
            ),
            themeMode:
                themeNotifier.isDarkMode ? ThemeMode.dark : ThemeMode.light,
            home: const SplashScreen(),
          );
        },
      ),
    );
  }
}
