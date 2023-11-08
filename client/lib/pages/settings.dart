import 'package:client/notifiers/user_notifier.dart';
import 'package:client/pages/add_router.dart';
import 'package:client/pages/profile.dart';
import 'package:client/pages/sign_in.dart';
import 'package:client/providers/user_service.dart';
import 'package:client/widgets/bottom_nav_bar.dart';
import 'package:client/widgets/top_app_bar.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:client/notifiers/theme_notifier.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({Key? key}) : super(key: key);
  @override
  SettingsPageState createState() => SettingsPageState();
}

class SettingsPageState extends State<SettingsPage> {
  bool isSuspended = true;
  bool isDarkModeEnabled = false;
  bool areNotificationsEnabled = true;

  @override
  Widget build(BuildContext context) {
    int currentIndex = 2;
    bool isDarkMode = Provider.of<ThemeNotifier>(context).isDarkMode;
    return Consumer<UserProvider>(builder: (context, userProvider, child) {
      return Material(
        child: Scaffold(
          bottomNavigationBar: BottomNav(currentIndex: currentIndex),
          appBar: const PreferredSize(
            preferredSize: Size.fromHeight(kToolbarHeight),
            child: TopAppBar(
              title: 'Settings',
            ),
          ),
          backgroundColor: isDarkMode
              ? const Color.fromARGB(255, 37, 37, 38)
              : const Color.fromARGB(255, 168, 168, 168),
          body: SingleChildScrollView(
            child: Padding(
              padding: const EdgeInsets.all(16.0),
              child: Column(
                children: [
                  Padding(
                    padding: const EdgeInsets.only(top: 24.0),
                    child: _buildButton("Profile", Icons.person, () {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => const ProfilePage()),
                      );
                    }),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(top: 24.0),
                    child: _buildButton("Help & Support", Icons.help, () {}),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(top: 24.0),
                    child: _buildSwitchButton("Notifications",
                        Icons.notifications, areNotificationsEnabled, (value) {
                      setState(() {
                        areNotificationsEnabled = value;
                      });
                    }),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(top: 24.0),
                    child: _buildSwitchButton(
                        "Dark Mode", Icons.nightlight_round, isDarkMode,
                        (value) {
                      setState(() {
                        Provider.of<ThemeNotifier>(context, listen: false)
                            .toggleTheme();
                      });
                    }),
                  ),
                  Padding(
                    padding: const EdgeInsets.only(top: 24.0),
                    child: _buildButton("Log Out", Icons.logout, () {
                      UserService().logoutUser(context);
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                            builder: (context) => const LoginPage()),
                      );
                    }),
                  ),
                ],
              ),
            ),
          ),
          floatingActionButton: Padding(
            padding: const EdgeInsets.fromLTRB(32, 0, 0, 24),
            child: ElevatedButton.icon(
              onPressed: () {
                Navigator.push(
                  context,
                  MaterialPageRoute(
                      builder: (context) => const AddRouterPage()),
                );
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.green,
                padding: const EdgeInsets.all(16.0), // Add padding here
                shape: RoundedRectangleBorder(
                  borderRadius:
                      BorderRadius.circular(10.0), // Add rounded corners here
                ),
              ),
              icon: const Icon(
                Icons.add,
                color: Colors.white,
              ),
              label: const Text(
                "Add Router",
                style: TextStyle(
                    color: Colors.white,
                    fontSize: 20,
                    fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ),
      );
    });
  }

  Widget _buildButton(String label, IconData icon, VoidCallback onPressed) {
    bool isDarkMode = Provider.of<ThemeNotifier>(context).isDarkMode;
    return ElevatedButton.icon(
      onPressed: onPressed,
      icon: Icon(
        icon,
        color: isDarkMode ? Colors.white : Colors.black,
      ),
      label: Text(
        label,
        style: TextStyle(
            fontSize: 20,
            fontWeight: FontWeight.bold,
            color: isDarkMode ? Colors.white : Colors.black),
      ),
    );
  }

  Widget _buildSwitchButton(
      String label, IconData icon, bool value, ValueChanged<bool> onChanged) {
    bool isDarkMode = Provider.of<ThemeNotifier>(context).isDarkMode;
    return Container(
      height: 70,
      decoration: BoxDecoration(
          color: isDarkMode
              ? const Color.fromARGB(255, 62, 62, 66)
              : const Color.fromARGB(255, 192, 192, 192),
          border: Border.all(
            color: isDarkMode
                ? const Color.fromARGB(255, 74, 74, 74)
                : const Color.fromARGB(255, 205, 205, 205),
            width: 2,
          ),
          borderRadius: BorderRadius.circular(0),
          shape: BoxShape.rectangle),
      child: Center(
        child: ListTile(
          leading: Icon(
            icon,
            color: isDarkMode ? Colors.white : Colors.black,
          ),
          title: Text(
            label,
            style: TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.bold,
                color: isDarkMode ? Colors.white : Colors.black),
          ),
          trailing: Switch(
              value: value,
              onChanged: onChanged,
              activeTrackColor: const Color.fromARGB(255, 195, 250, 55),
              thumbColor: MaterialStateColor.resolveWith(
                  (states) => const Color.fromARGB(255, 46, 45, 45)),
              trackOutlineColor: MaterialStateColor.resolveWith(
                  (states) => const Color.fromARGB(0, 224, 224, 224))),
        ),
      ),
    );
  }
}
