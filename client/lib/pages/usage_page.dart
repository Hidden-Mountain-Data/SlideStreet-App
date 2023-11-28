import 'package:client/models/data_usage.dart';
import 'package:client/pages/add_router.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
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
  const UsagePage({super.key});

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
      double usageInGb = usage / 1048576;
      return '${usageInGb.toStringAsFixed(2)} Mb';
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
                  builder: (context, routerSnapshot) {
                    if (routerSnapshot.connectionState ==
                        ConnectionState.waiting) {
                      return const Center(child: CircularProgressIndicator());
                    } else if (routerSnapshot.hasError) {
                      return Center(
                          child: Text('Error: ${routerSnapshot.error}'));
                    } else if (routerSnapshot.hasData &&
                        routerSnapshot.data!.isNotEmpty) {
                      List<Routers> routers = routerSnapshot.data!;

                      return Stack(
                        children: [
                          Column(
                            children: [
                              FutureBuilder<List<DataUsage>>(
                                future: _usageService.fetchDataUsage(),
                                builder: (context, usageSnapshot) {
                                  if (usageSnapshot.connectionState ==
                                      ConnectionState.waiting) {
                                    return const Center(
                                        child: CircularProgressIndicator());
                                  } else if (usageSnapshot.hasError) {
                                    return Center(
                                        child: Text(
                                            'Error: ${usageSnapshot.error}'));
                                  } else {
                                    return SizedBox(
                                      height:
                                          MediaQuery.of(context).size.height *
                                              0.55,
                                      child: RouterUsageCard(
                                        title: "name",
                                        totalUsage: "total",
                                        routerData: routers,
                                        usageData: usageSnapshot.data!,
                                      ),
                                    );
                                  }
                                },
                              ),
                              Padding(
                                padding: const EdgeInsets.all(16.0),
                                child: Align(
                                  alignment: Alignment.centerLeft,
                                  child: Text(
                                    "Connected Routers",
                                    style: GoogleFonts.openSans(
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
                                      future: _usageService.fetchDataUsageBySim(
                                          routerData.simId),
                                      builder: (context, usageSnapshot) {
                                        if (usageSnapshot.connectionState ==
                                            ConnectionState.waiting) {
                                          return const Center(
                                              child:
                                                  CircularProgressIndicator());
                                        } else if (usageSnapshot.hasError) {
                                          return Center(
                                              child: Text(
                                                  'Error: ${usageSnapshot.error}'));
                                        } else {
                                          // Use fetchRouterById to get router details
                                          return FutureBuilder(
                                            future:
                                                _routerService.fetchRouterById(
                                                    routerData.routerId),
                                            builder: (context,
                                                routerDetailsSnapshot) {
                                              if (routerDetailsSnapshot
                                                      .connectionState ==
                                                  ConnectionState.waiting) {
                                                return const Center(
                                                    child:
                                                        CircularProgressIndicator());
                                              } else if (routerDetailsSnapshot
                                                  .hasError) {
                                                return Center(
                                                    child: Text(
                                                        'Error: ${routerDetailsSnapshot.error}'));
                                              } else {
                                                final routerDetails =
                                                    routerDetailsSnapshot.data!;
                                                return RouterCard(
                                                  name: routerDetails.name,
                                                  status: routerDetails
                                                      .sims[0].status,
                                                  usage: convertUsage(
                                                      double.parse(usageSnapshot
                                                          .data!.dataUsage)),
                                                  signalStrength: "Excellent",
                                                  imei: routerDetails.imei,
                                                  simNumber:
                                                      routerData.sims[0].iccid,
                                                  ipAddress: routerData
                                                          .sims[0].ipAddress ??
                                                      "No IP Address",
                                                  notes: routerDetails.notes ??
                                                      "No notes",
                                                );
                                              }
                                            },
                                          );
                                        }
                                      },
                                    );
                                  },
                                ),
                              ),
                            ],
                          ),
                          if (routerSnapshot.connectionState ==
                              ConnectionState.waiting)
                            Container(
                              color: Colors.black.withOpacity(0.7),
                              child: const Center(
                                child: CircularProgressIndicator(
                                  color: Colors.white,
                                ),
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
        Text(
          'No connected routers',
          style:
              GoogleFonts.montserrat(fontSize: 24, fontWeight: FontWeight.w900),
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
            label: Text(
              "Add Router",
              style: GoogleFonts.montserrat(
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
