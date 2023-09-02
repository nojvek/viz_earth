<?php
	$countries = csvToArray('country_latlng.csv');
	$lifeTable = csvToArray('life.csv', true);
	$gdpTable = csvToArray('gdp.csv', true);
	$populationTable = csvToArray('population.csv', true);

	print_r($life);

	echo "country, code, year, lat, lng, life, population, gdp\n";
	foreach($countries as $country){
		for($year = 1961; $year <= 2013; $year++ ){
			$countryName = $country['country'];
			$code = $country['code'];
			$lat = $country['lat'];
			$lng = $country['lng'];
			$life = $lifeTable[$code][$year];
			$population = $populationTable[$code][$year];
			$gdp = $gdpTable[$code][$year];

			if($life && $population && $gdp){
				$line = "\"$countryName\", $code, $year, $lat, $lng, $life, $population, $gdp\n";
				echo $line;				
			}
		}
	}


	function csvToArray($filename, $assoc = false){
		$arr = [];
		$lines = file($filename);
		$keys = null;
		foreach($lines as $line){
			if(!$keys) $keys = str_getcsv($line);
			else {
				$values = str_getcsv($line);
				$obj = array_combine($keys, $values);
				if($assoc) {
					$arr[$obj['country']] = $obj;
				}else {
					$arr[] = $obj;
				}
			}
		}
		return $arr;
	}
?>