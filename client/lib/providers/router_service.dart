import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:client/models/router.dart';
import 'package:flutter_dotenv/flutter_dotenv.dart';
import 'helpers.dart';

class RouterService {
  Future<List<Routers>> fetchRouters() async {
    final header = await getAuth();
    final userString = await getUser();
    final user = jsonDecode(userString!);
    final userId = user['user_id'];
    //final url = dotenv.env['NEST_API_URL'];
    final url = dotenv.env['NEST_API_URL_ANDROID'];
    final response = await http.get(
      Uri.parse('$url/api/routers/$userId'),
      headers: header,
    );
    if (response.statusCode == 200) {
      var jsonData = json.decode(response.body);
      var routersList = jsonData['data'] as List;
      return routersList.map((router) => Routers.fromJson(router)).toList();
    } else {
      throw Exception(response.body);
    }
  }

  Future<Routers> fetchRouter(int routerId) async {
    final header = await getAuth();
    //final url = dotenv.env['NEST_API_URL'];
    final url = dotenv.env['NEST_API_URL_ANDROID'];
    final response = await http.get(
        Uri.parse('$url/api/routers/router-details/$routerId'),
        headers: header);
    if (response.statusCode == 200) {
      final router = jsonDecode(response.body);
      return router;
    } else {
      throw Exception('Failed to fetch router');
    }
  }
}
