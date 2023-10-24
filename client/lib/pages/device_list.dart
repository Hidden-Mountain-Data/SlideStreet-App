import 'package:client/widgets/bottom_nav_bar.dart';
import 'package:client/widgets/router_card.dart';
import 'package:client/widgets/top_app_bar.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:client/notifiers/theme_notifier.dart';
import 'package:client/test_data/usage_data.dart';

class DeviceListPage extends StatefulWidget {
  const DeviceListPage({super.key});
  @override
  DeviceListPageState createState() => DeviceListPageState();
}

class DeviceListPageState extends State<DeviceListPage> {
  @override
  @override
  Widget build(BuildContext context) {
    int currentIndex = 0;

    return Material(child: Consumer<ThemeNotifier>(
      builder: (context, themeNotifier, child) {
        return Scaffold(
          bottomNavigationBar: BottomNav(currentIndex: currentIndex),
          appBar: const PreferredSize(
            preferredSize: Size.fromHeight(kToolbarHeight),
            child: TopAppBar(
              title: 'Device List',
            ),
          ),
          backgroundColor: themeNotifier.isDarkMode
              ? const Color.fromARGB(255, 37, 37, 38)
              : const Color.fromARGB(255, 168, 168, 168),
          body: Column(
            children: [
              const Padding(
                padding: EdgeInsets.all(16.0),
                child: Align(
                  alignment: Alignment.centerLeft,
                  child: Text(
                    "Connected Routers",
                    style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.w900,
                    ),
                  ),
                ),
              ),
              Expanded(
                child: ListView.builder(
                  itemCount: exampleUsageData.length,
                  itemBuilder: (context, index) {
                    final routerData = exampleUsageData[index];
                    return RouterCard2(
                      name: routerData['router'],
                      status: routerData['status'],
                      usage: routerData['usage'].toDouble(),
                      speed: routerData['speed'],
                      imei: routerData['imei'],
                      simNumber: routerData['simNumber'],
                      ipAddress: routerData['ipAddress'],
                      notes: routerData['notes'],
                    );
                  },
                ),
              ),
            ],
          ),
        );
      },
    ));
  }
}
