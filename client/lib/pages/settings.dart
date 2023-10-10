import 'package:client/widgets/bottom_nav_bar.dart';
import 'package:client/widgets/top_app_bar.dart';
import 'package:flutter/material.dart';

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

    return Material(
      child: Scaffold(
        bottomNavigationBar: BottomNav(currentIndex: currentIndex),
        appBar: const PreferredSize(
          preferredSize: Size.fromHeight(kToolbarHeight),
          child: TopAppBar(
            title: 'Settings',
          ),
        ),
        backgroundColor: const Color.fromARGB(255, 168, 168, 168),
        body: SingleChildScrollView(
          child: Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              children: [
                Padding(
                  padding: const EdgeInsets.only(top: 24.0),
                  child: _buildButton("Profile", Icons.person, () {}),
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
                      "Dark Mode", Icons.nightlight_round, isDarkModeEnabled,
                      (value) {
                    setState(() {
                      isDarkModeEnabled = value;
                    });
                  }),
                ),
                Padding(
                  padding: const EdgeInsets.only(top: 24.0),
                  child: _buildButton("Log Out", Icons.logout, () {}),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildButton(String label, IconData icon, VoidCallback onPressed) {
    return ElevatedButton.icon(
      onPressed: onPressed,
      icon: Icon(icon),
      label: Text(label),
    );
  }

  Widget _buildSwitchButton(
      String label, IconData icon, bool value, ValueChanged<bool> onChanged) {
    return Container(
      height: 70,
      decoration: BoxDecoration(
          color: const Color.fromARGB(255, 192, 192, 192),
          border: Border.all(
            color: const Color.fromARGB(255, 205, 205, 205),
            width: 2,
          ),
          borderRadius: BorderRadius.circular(0),
          shape: BoxShape.rectangle),
      child: Center(
        child: ListTile(
          leading: Icon(icon),
          title: Text(label),
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
