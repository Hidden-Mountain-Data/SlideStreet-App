import 'dart:convert';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'package:client/models/data_usage.dart';
import 'package:http/http.dart' as http;
import 'helpers.dart';

class DataUsageService {
  Future<DataUsage> fetchDataUsageBySim(int simId) async {
    final header = await getAuth();
    final userString = await getUser();
    final user = jsonDecode(userString!);
    final userId = user['user_id'];
    //final url = dotenv.env['NEST_API_URL'];
    final url = dotenv.env['NEST_API_URL_ANDROID'];
    final response = await http.get(Uri.parse('$url/api/data-usage/$simId'),
        headers: header);
    if (response.statusCode == 200) {
      final data = jsonDecode(response.body);
      if (data['data'] == null) {
        final usage = DataUsage(
            dataUsageId: 0,
            dateId: 0,
            simId: 9,
            userId: userId,
            dataUsage: "0");
        return usage;
      } else {
        final usage = data['data'][0];
        return DataUsage.fromJson(usage);
      }
    } else {
      throw Exception('Failed to fetch usage data');
    }
  }

  Future<List<DataUsage>> fetchDataUsage() async {
    final header = await getAuth();
    //final url = dotenv.env['NEST_API_URL'];
    final url = dotenv.env['NEST_API_URL_ANDROID'];
    final response =
        await http.get(Uri.parse('$url/api/data-usage'), headers: header);
    if (response.statusCode == 200) {
      var jsonData = json.decode(response.body);
      var dataList = jsonData['data'] as List;
      return dataList.map((data) => DataUsage.fromJson(data)).toList();
    } else {
      throw Exception('Failed to fetch usage data');
    }
  }
}
