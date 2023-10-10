import 'package:client/widgets/bottom_nav_bar.dart';
import 'package:client/widgets/router_card.dart';
import 'package:client/widgets/top_app_bar.dart';
import 'package:client/widgets/usage_chart.dart';
import 'package:flutter/material.dart';

class UsagePage extends StatefulWidget {
  const UsagePage({super.key});
  @override
  UsagePageState createState() => UsagePageState();
}

class UsagePageState extends State<UsagePage> {
  @override
  @override
  Widget build(BuildContext context) {
    final List<Map<String, dynamic>> exampleUsageData = [
      {
        'router': 'Router 1',
        'date': DateTime(2023, 9, 26),
        'usage': 5,
        'status': 'Active',
        'signalStrength': 'Excellent',
      },
      {
        'router': 'Router 2',
        'date': DateTime(2023, 9, 27),
        'usage': 2.1,
        'status': 'Deactivated',
        'signalStrength': 'Good',
      },
      {
        'router': 'Router 3',
        'date': DateTime(2023, 9, 28),
        'usage': 1.1,
        'status': 'Suspended',
        'signalStrength': 'Poor',
      },
      {
        'router': 'Router 4',
        'date': DateTime(2023, 9, 29),
        'usage': 3.5,
        'status': 'Active',
        'signalStrength': 'Excellent',
      },
      {
        'router': 'Router 5',
        'date': DateTime(2023, 9, 30),
        'usage': 4.2,
        'status': 'Active',
        'signalStrength': 'Good',
      },
      {
        'router': 'Router 6',
        'date': DateTime(2023, 10, 1),
        'usage': 2.8,
        'status': 'Deactivated',
        'signalStrength': 'Poor',
      },
      {
        'router': 'Router 7',
        'date': DateTime(2023, 10, 2),
        'usage': 3.7,
        'status': 'Suspended',
        'signalStrength': 'Good',
      },
    ];

    int currentIndex = 1;

    return Material(
      child: Scaffold(
        bottomNavigationBar: BottomNav(currentIndex: currentIndex),
        appBar: const PreferredSize(
          preferredSize: Size.fromHeight(kToolbarHeight),
          child: TopAppBar(
            title: 'Usage',
          ),
        ),
        backgroundColor: const Color.fromARGB(255, 168, 168, 168),
        body: Column(
          children: [
            SizedBox(
              height: 400,
              child: RouterUsageCard(
                  title: "name",
                  totalUsage: "total",
                  usageData: exampleUsageData),
            ),
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
                  return RouterCard(
                    name: routerData['router'],
                    status: routerData['status'],
                    usage: routerData['usage'].toDouble(),
                    signalStrength: routerData['signalStrength'],
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
