import 'package:client/notifiers/user_notifier.dart';
import 'package:client/pages/change_password.dart';
import 'package:client/pages/edit_info.dart';
import 'package:client/pages/sign_in.dart';
import 'package:client/providers/user_service.dart';
import 'package:client/widgets/bottom_nav_bar.dart';
import 'package:flutter/material.dart';
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

    return Consumer<UserProvider>(
      builder: (context, userProvider, child) {
        return Consumer<ThemeNotifier>(
          builder: (context, themeNotifier, child) {
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
                        style: TextStyle(
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
                        const CircleAvatar(
                          radius: 60,
                          backgroundImage: AssetImage('assets/profile.png'),
                        ),
                        const SizedBox(height: 10),
                        Text(
                          '${userProvider.user!.firstName} ${userProvider.user!.lastName}',
                          style: const TextStyle(
                            fontSize: 24,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 30),
                        ProfileButton(
                          text: userProvider.user!.email,
                          onPressed: () {
                            return;
                          },
                        ),
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
                        ProfileButton(
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
          style: const TextStyle(fontSize: 18),
        ),
      ),
    );
  }
}
