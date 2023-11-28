import 'dart:async';
import 'package:flutter/material.dart';
import 'package:client/models/router.dart';
import 'package:client/pages/add_router.dart';
import 'package:client/widgets/bottom_nav_bar.dart';
import 'package:client/widgets/router_card.dart';
import 'package:client/widgets/search_bar.dart';
import 'package:client/widgets/top_app_bar.dart';
import 'package:client/providers/router_service.dart';
import 'package:client/providers/usage_service.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:provider/provider.dart';
import 'package:client/notifiers/theme_notifier.dart';

class DeviceListPage extends StatefulWidget {
  const DeviceListPage({super.key});
  @override
  DeviceListPageState createState() => DeviceListPageState();
}

class DeviceListPageState extends State<DeviceListPage> {
  final _debouncer = Debouncer();
  late RouterService _routerService;
  late DataUsageService _usageService;
  TextEditingController searchController = TextEditingController();
  List<Routers> rList = [];
  List<Routers> routerList = [];

  @override
  void initState() {
    super.initState();
    _routerService = RouterService();
    _usageService = DataUsageService();

    fetchRouters().then((value) {
      setState(() {
        rList = value;
        routerList = rList;
      });
    });
  }

  Future<List<Routers>> fetchRouters() async {
    return _routerService.fetchRouters();
  }

  void searchRouters(String searchQuery) {
    setState(() {
      routerList = rList
          .where((router) =>
              router.name.toLowerCase().contains(searchQuery.toLowerCase()))
          .toList();
    });
  }

  String convertUsage(double usage) {
    if (usage > 1000) {
      double usageInGb = usage / 1048576;
      return '${usageInGb.toStringAsFixed(2)} Mb.';
    } else {
      return '$usage Mb';
    }
  }

  @override
  Widget build(BuildContext context) {
    int currentIndex = 0;

    return Material(
      child: Consumer<ThemeNotifier>(
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
            body: FutureBuilder<List<Routers>>(
              future: _routerService.fetchRouters(),
              builder: (context, snapshot) {
                if (snapshot.connectionState == ConnectionState.waiting) {
                  return const Center(child: CircularProgressIndicator());
                } else if (snapshot.hasError) {
                  return Center(child: Text('Error: ${snapshot.error}'));
                } else if (snapshot.hasData && snapshot.data!.isNotEmpty) {
                  List<Routers> routers = snapshot.data!.where((router) {
                    final query = searchController.text.toLowerCase();
                    return router.name.toLowerCase().contains(query);
                  }).toList();

                  return Stack(
                    children: [
                      Column(
                        children: [
                          Padding(
                            padding: const EdgeInsets.all(16.0),
                            child: Align(
                              alignment: Alignment.centerLeft,
                              child: Text(
                                "Connected Routers",
                                style: GoogleFonts.openSans(
                                  fontSize: 32,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ),
                          ),
                          RouterSearchBar(
                            searchController: searchController,
                            onSearchTextChanged: (String string) {
                              _debouncer.run(() {
                                searchRouters(string);
                              });
                            },
                          ),
                          Expanded(
                            child: ListView.builder(
                              physics: const ClampingScrollPhysics(),
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
                                      return RouterCard2(
                                        name: routerData.name,
                                        status: routerData.sims[0].status,
                                        usage: convertUsage(double.parse(
                                            snapshot.data!.dataUsage)),
                                        speed: "temp",
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
                      ),
                      if (snapshot.connectionState == ConnectionState.waiting)
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
              style: GoogleFonts.openSans(
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
