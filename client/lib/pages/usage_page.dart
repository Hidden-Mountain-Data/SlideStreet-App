import 'package:client/notifiers/user_notifier.dart';
import 'package:client/providers/router_service.dart';
import 'package:client/widgets/bottom_nav_bar.dart';
import 'package:client/widgets/router_card.dart';
import 'package:client/widgets/top_app_bar.dart';
import 'package:client/widgets/usage_chart.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:client/notifiers/theme_notifier.dart';
import 'package:client/test_data/usage_data.dart';
import 'package:client/models/router.dart';

class UsagePage extends StatefulWidget {
  const UsagePage({super.key});

  @override
  UsagePageState createState() => UsagePageState();
}

class UsagePageState extends State<UsagePage> {
  late RouterService _routerService;

  @override
  void initState() {
    super.initState();
    _routerService = RouterService(); // Initialize the RouterService
  }

  @override
  Widget build(BuildContext context) {
    int currentIndex = 1;

    return Material(
      child: Consumer<UserProvider>(builder: (context, user, child) {
        return Consumer<ThemeNotifier>(
          builder: (context, themeNotifier, child) {
            return Scaffold(
              bottomNavigationBar: BottomNav(currentIndex: currentIndex),
              appBar: const PreferredSize(
                preferredSize: Size.fromHeight(kToolbarHeight),
                child: TopAppBar(
                  title: "Usage Details",
                ),
              ),
              backgroundColor: themeNotifier.isDarkMode
                  ? const Color.fromARGB(255, 37, 37, 38)
                  : const Color.fromARGB(255, 168, 168, 168),
              body: FutureBuilder<List<Routers>>(
                future: _routerService.fetchRouters(),
                builder: (context, snapshot) {
                  if (snapshot.connectionState == ConnectionState.waiting) {
                    return Center(child: CircularProgressIndicator());
                  } else if (snapshot.hasError) {
                    return Center(child: Text('Error: ${snapshot.error}'));
                  } else if (snapshot.hasData) {
                    List<Routers> routers = snapshot.data!;

                    return Column(
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
                              ),
                            ),
                          ),
                        ),
                        Expanded(
                          child: ListView.builder(
                            itemCount: routers.length,
                            itemBuilder: (context, index) {
                              final routerData = routers[index];
                              return RouterCard(
                                name: routerData.name,
                                status: routerData.sims[0].status,
                                usage: 1,
                                signalStrength: "temp",
                                imei: routerData.imei,
                                simNumber: routerData.sims[0].iccid,
                                ipAddress: routerData.sims[0].iccid,
                                notes: routerData.notes ?? "No notes",
                              );
                            },
                          ),
                        ),
                      ],
                    );
                  } else {
                    return const Center(child: Text('No data available'));
                  }
                },
              ),
            );
          },
        );
      }),
    );
  }
}
