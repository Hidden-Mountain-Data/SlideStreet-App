import 'package:client/models/data_usage.dart';
import 'package:client/pages/add_router.dart';
import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:client/notifiers/theme_notifier.dart';
import 'package:client/notifiers/user_notifier.dart';
import 'package:client/providers/router_service.dart';
import 'package:client/providers/usage_service.dart';
import 'package:client/widgets/bottom_nav_bar.dart';
import 'package:client/widgets/router_card.dart';
import 'package:client/widgets/top_app_bar.dart';
import 'package:client/widgets/usage_chart.dart';
import 'package:client/models/router.dart';

class UsagePage extends StatefulWidget {
  const UsagePage({Key? key});

  @override
  UsagePageState createState() => UsagePageState();
}

class UsagePageState extends State<UsagePage> {
  late RouterService _routerService;
  late DataUsageService _usageService;

  @override
  void initState() {
    super.initState();
    _routerService = RouterService();
    _usageService = DataUsageService();
  }

  String convertUsage(double usage) {
    if (usage > 1000) {
      double usageInGb = usage / 1000;
      return '$usageInGb Gb';
    } else {
      return '$usage Mb';
    }
  }

  @override
  Widget build(BuildContext context) {
    int currentIndex = 1;

    return Material(
      child: Consumer<UserProvider>(
        builder: (context, user, child) {
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
                      return const Center(child: CircularProgressIndicator());
                    } else if (snapshot.hasError) {
                      return Center(child: Text('Error: ${snapshot.error}'));
                    } else if (snapshot.hasData && snapshot.data!.isNotEmpty) {
                      List<Routers> routers = snapshot.data!;

                      return Column(
                        children: [
                          FutureBuilder<List<DataUsage>>(
                            future: _usageService.fetchDataUsage(),
                            builder: (context, snapshot) {
                              if (snapshot.connectionState ==
                                  ConnectionState.waiting) {
                                return const Center(
                                    child: CircularProgressIndicator());
                              } else if (snapshot.hasError) {
                                return Center(
                                    child: Text('Error: ${snapshot.error}'));
                              } else {
                                return SizedBox(
                                  height: 400,
                                  child: RouterUsageCard(
                                    title: "name",
                                    totalUsage: "total",
                                    routerData: routers,
                                    usageData: snapshot.data!,
                                  ),
                                );
                              }
                            },
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
                                return FutureBuilder(
                                  future: _usageService
                                      .fetchDataUsageBySim(routerData.simId),
                                  builder: (context, snapshot) {
                                    if (snapshot.connectionState ==
                                        ConnectionState.waiting) {
                                      return const Center(
                                          child: CircularProgressIndicator());
                                    } else if (snapshot.hasError) {
                                      return Center(
                                          child:
                                              Text('Error: ${snapshot.error}'));
                                    } else {
                                      return RouterCard(
                                        name: routerData.name,
                                        status: routerData.sims[0].status,
                                        usage: convertUsage(double.parse(
                                            snapshot.data!.dataUsage)),
                                        signalStrength: "Excellent",
                                        imei: routerData.imei,
                                        simNumber: routerData.sims[0].iccid,
                                        ipAddress:
                                            routerData.sims[0].ipAddress ??
                                                "No IP Address",
                                        notes: routerData.notes ?? "No notes",
                                      );
                                    }
                                  },
                                );
                              },
                            ),
                          ),
                        ],
                      );
                    } else {
                      return _buildNoConnectedRoutersWidget();
                    }
                  },
                ),
              );
            },
          );
        },
      ),
    );
  }

  Widget _buildNoConnectedRoutersWidget() {
    return Column(
      mainAxisAlignment: MainAxisAlignment.center,
      crossAxisAlignment: CrossAxisAlignment.center,
      children: [
        const Text(
          'No connected routers',
          style: TextStyle(fontSize: 24, fontWeight: FontWeight.w900),
        ),
        const SizedBox(height: 16),
        Padding(
          padding: const EdgeInsets.fromLTRB(32, 0, 32, 24),
          child: ElevatedButton.icon(
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (context) => const AddRouterPage()),
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
      ],
    );
  }
}
