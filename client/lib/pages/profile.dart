import 'package:client/notifiers/user_notifier.dart';
import 'package:client/pages/change_password.dart';
import 'package:client/pages/edit_info.dart';
import 'package:client/pages/sign_in.dart';
import 'package:client/providers/user_service.dart';
import 'package:client/widgets/bottom_nav_bar.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:client/notifiers/theme_notifier.dart';

class ProfilePage extends StatefulWidget {
  const ProfilePage({Key? key}) : super(key: key);
  @override
  ProfilePageState createState() => ProfilePageState();
}

class ProfilePageState extends State<ProfilePage> {
  bool isSuspended = true;
  bool isDarkModeEnabled = false;
  bool areNotificationsEnabled = true;

  @override
  Widget build(BuildContext context) {
    int currentIndex = 2;
    double containerWidth = MediaQuery.of(context).size.width - 32;

    Widget buildTextField(String label, String value, double height,
        Color color, Color borderColor) {
      return Container(
        width: containerWidth,
        height: height,
        decoration: BoxDecoration(
          color: color,
          border: Border.all(
            color: borderColor,
            width: 2,
          ),
          borderRadius: BorderRadius.circular(5),
          shape: BoxShape.rectangle,
        ),
        padding: const EdgeInsets.all(8),
        margin: const EdgeInsets.only(bottom: 20),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              label,
              style: GoogleFonts.openSans(
                  fontSize: 20, fontWeight: FontWeight.w800),
            ),
            const SizedBox(height: 5),
            Text(
              value,
              style: GoogleFonts.montserrat(fontSize: 18),
            ),
          ],
        ),
      );
    }

    return Consumer<UserProvider>(
      builder: (context, userProvider, child) {
        return Consumer<ThemeNotifier>(
          builder: (context, themeNotifier, child) {
            Color cardColor = themeNotifier.isDarkMode
                ? const Color.fromARGB(255, 62, 62, 66)
                : const Color.fromARGB(255, 192, 191, 192);
            Color borderColor = themeNotifier.isDarkMode
                ? const Color.fromARGB(255, 74, 74, 74)
                : const Color.fromARGB(255, 205, 205, 205);
            return Material(
              child: Scaffold(
                backgroundColor: themeNotifier.isDarkMode
                    ? const Color.fromARGB(255, 37, 37, 38)
                    : const Color.fromARGB(255, 168, 168, 168),
                bottomNavigationBar: BottomNav(currentIndex: currentIndex),
                appBar: AppBar(
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
                        'Profile',
                        style: GoogleFonts.montserrat(
                          fontSize: 32,
                          fontWeight: FontWeight.w900,
                          color: themeNotifier.isDarkMode
                              ? const Color.fromARGB(255, 255, 255, 255)
                              : const Color.fromARGB(255, 0, 0, 0),
                        ),
                      ),
                      IconButton(
                        icon: Icon(
                          Icons.chevron_left_rounded,
                          size: 40,
                          color: themeNotifier.isDarkMode
                              ? const Color.fromARGB(255, 255, 255, 255)
                              : const Color.fromARGB(255, 0, 0, 0),
                        ),
                        onPressed: () {
                          Navigator.pop(context);
                        },
                      ),
                    ],
                  ),
                ),
                body: SingleChildScrollView(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(8, 16, 8, 16),
                    child: Column(
                      children: [
                        const SizedBox(height: 30),
                        buildTextField(
                            'First Name',
                            userProvider.user!.firstName,
                            80,
                            cardColor,
                            borderColor),
                        buildTextField('Last Name', userProvider.user!.lastName,
                            80, cardColor, borderColor),
                        buildTextField('Email', userProvider.user!.email, 80,
                            cardColor, borderColor),
                        ProfileButton(
                          text: 'Change Password',
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) =>
                                      const ChangePasswordPage()),
                            );
                          },
                        ),
                        ProfileButton(
                          text: 'Edit Information',
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) =>
                                      const EditInformationPage()),
                            );
                          },
                        ),
                        LogoutButton(
                          text: 'Log Out',
                          onPressed: () {
                            UserService().logoutUser(context);
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                  builder: (context) => const LoginPage()),
                            );
                          },
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            );
          },
        );
      },
    );
  }
}

class ProfileButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;

  const ProfileButton({super.key, required this.text, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
      child: ElevatedButton(
        onPressed: onPressed,
        child: Text(
          text,
          style:
              GoogleFonts.openSans(fontSize: 20, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }
}

class LogoutButton extends StatelessWidget {
  final String text;
  final VoidCallback onPressed;

  const LogoutButton({super.key, required this.text, required this.onPressed});

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 20),
      child: ElevatedButton(
        style: ButtonStyle(
          backgroundColor: MaterialStateProperty.all<Color>(
              const Color.fromARGB(255, 182, 15, 15)),
        ),
        onPressed: onPressed,
        child: Text(
          text,
          style:
              GoogleFonts.openSans(fontSize: 24, fontWeight: FontWeight.w600),
        ),
      ),
    );
  }
}
