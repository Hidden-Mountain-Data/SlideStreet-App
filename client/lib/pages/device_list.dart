import 'package:client/widgets/bottom_nav_bar.dart';
import 'package:client/widgets/router_card.dart';
import 'package:client/widgets/top_app_bar.dart';
import 'package:flutter/material.dart';

class DeviceListPage extends StatefulWidget {
  const DeviceListPage({super.key});
  @override
  DeviceListPageState createState() => DeviceListPageState();
}

class DeviceListPageState extends State<DeviceListPage> {
  @override
  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> exampleUsageData = [
      {
        'router': 'Router 1',
        'date': DateTime(2023, 9, 26),
        'usage': 5,
        'status': 'Active',
        'speed': '100 Mbps',
      },
      {
        'router': 'Router 2',
        'date': DateTime(2023, 9, 27),
        'usage': 2.1,
        'status': 'Deactivated',
        'speed': '921 Mbps',
      },
      {
        'router': 'Router 3',
        'date': DateTime(2023, 9, 28),
        'usage': 1.1,
        'status': 'Suspended',
        'speed': '215 Mbps',
      },
      {
        'router': 'Router 4',
        'date': DateTime(2023, 9, 29),
        'usage': 3.5,
        'status': 'Active',
        'speed': '63 Mbps',
      },
      {
        'router': 'Router 5',
        'date': DateTime(2023, 9, 30),
        'usage': 4.2,
        'status': 'Active',
        'speed': '22 Mbps',
      },
      {
        'router': 'Router 6',
        'date': DateTime(2023, 10, 1),
        'usage': 2.8,
        'status': 'Deactivated',
        'speed': '0 Mbps',
      },
      {
        'router': 'Router 7',
        'date': DateTime(2023, 10, 2),
        'usage': 3.7,
        'status': 'Suspended',
        'speed': '321 Mbps',
      },
    ];

    int currentIndex = 0;

    return Material(
      child: Scaffold(
        bottomNavigationBar: BottomNav(currentIndex: currentIndex),
        appBar: const PreferredSize(
          preferredSize: Size.fromHeight(kToolbarHeight),
          child: TopAppBar(
            title: 'Device List',
          ),
        ),
        backgroundColor: const Color.fromARGB(255, 168, 168, 168),
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
                    color: Color.fromARGB(255, 0, 0, 0),
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
                    signalStrength: routerData['speed'],
                  );
                },
              ),
            ),
          ],
        ),
      ),
    );
  }
}
