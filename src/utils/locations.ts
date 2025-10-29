// Location data for dynamic state/city selection

export interface Country {
  code: string;
  name: string;
  states: State[];
}

export interface State {
  code: string;
  name: string;
  cities: string[];
}

// Comprehensive location data
export const locationData: Country[] = [
  {
    code: "US",
    name: "United States",
    states: [
      {
        code: "CA",
        name: "California",
        cities: ["Los Angeles", "San Francisco", "San Diego", "San Jose", "Sacramento"]
      },
      {
        code: "NY",
        name: "New York",
        cities: ["New York City", "Buffalo", "Rochester", "Albany", "Syracuse"]
      },
      {
        code: "TX",
        name: "Texas",
        cities: ["Houston", "Dallas", "Austin", "San Antonio", "Fort Worth"]
      },
      {
        code: "FL",
        name: "Florida",
        cities: ["Miami", "Orlando", "Tampa", "Jacksonville", "Fort Lauderdale"]
      }
    ]
  },
  {
    code: "NG",
    name: "Nigeria",
    states: [
      {
        code: "LA",
        name: "Lagos",
        cities: ["Ikeja", "Victoria Island", "Lekki", "Surulere", "Ikoyi", "Yaba", "Ajah"]
      },
      {
        code: "AB",
        name: "Abuja FCT",
        cities: ["Garki", "Wuse", "Maitama", "Asokoro", "Gwarinpa", "Kubwa"]
      },
      {
        code: "KN",
        name: "Kano",
        cities: ["Kano Municipal", "Fagge", "Dala", "Gwale", "Tarauni"]
      },
      {
        code: "OY",
        name: "Oyo",
        cities: ["Ibadan", "Ogbomosho", "Oyo", "Iseyin", "Saki"]
      },
      {
        code: "ON",
        name: "Ondo",
        cities: ["Akure", "Ondo", "Owo", "Ikare", "Ore"]
      },
      {
        code: "OG",
        name: "Ogun",
        cities: ["Abeokuta", "Ijebu-Ode", "Sagamu", "Ota", "Ilaro"]
      }
    ]
  },
  {
    code: "GB",
    name: "United Kingdom",
    states: [
      {
        code: "ENG",
        name: "England",
        cities: ["London", "Manchester", "Birmingham", "Liverpool", "Leeds", "Bristol"]
      },
      {
        code: "SCT",
        name: "Scotland",
        cities: ["Edinburgh", "Glasgow", "Aberdeen", "Dundee", "Inverness"]
      },
      {
        code: "WLS",
        name: "Wales",
        cities: ["Cardiff", "Swansea", "Newport", "Wrexham", "Barry"]
      }
    ]
  },
  {
    code: "CA",
    name: "Canada",
    states: [
      {
        code: "ON",
        name: "Ontario",
        cities: ["Toronto", "Ottawa", "Mississauga", "Hamilton", "London"]
      },
      {
        code: "QC",
        name: "Quebec",
        cities: ["Montreal", "Quebec City", "Laval", "Gatineau", "Longueuil"]
      },
      {
        code: "BC",
        name: "British Columbia",
        cities: ["Vancouver", "Victoria", "Surrey", "Burnaby", "Richmond"]
      }
    ]
  },
  {
    code: "GH",
    name: "Ghana",
    states: [
      {
        code: "AA",
        name: "Greater Accra",
        cities: ["Accra", "Tema", "Madina", "Teshie", "Nungua"]
      },
      {
        code: "AH",
        name: "Ashanti",
        cities: ["Kumasi", "Obuasi", "Mampong", "Konongo", "Ejisu"]
      },
      {
        code: "WP",
        name: "Western",
        cities: ["Sekondi-Takoradi", "Tarkwa", "Axim", "Prestea", "Elubo"]
      }
    ]
  },
  {
    code: "KE",
    name: "Kenya",
    states: [
      {
        code: "NBO",
        name: "Nairobi",
        cities: ["Nairobi", "Westlands", "Kilimani", "Karen", "Lavington"]
      },
      {
        code: "MBA",
        name: "Mombasa",
        cities: ["Mombasa", "Likoni", "Changamwe", "Kisauni", "Nyali"]
      },
      {
        code: "KSM",
        name: "Kisumu",
        cities: ["Kisumu", "Ahero", "Maseno", "Kondele", "Mamboleo"]
      }
    ]
  },
  {
    code: "ZA",
    name: "South Africa",
    states: [
      {
        code: "GT",
        name: "Gauteng",
        cities: ["Johannesburg", "Pretoria", "Soweto", "Sandton", "Midrand"]
      },
      {
        code: "WC",
        name: "Western Cape",
        cities: ["Cape Town", "Stellenbosch", "Paarl", "George", "Worcester"]
      },
      {
        code: "KZN",
        name: "KwaZulu-Natal",
        cities: ["Durban", "Pietermaritzburg", "Richards Bay", "Newcastle", "Port Shepstone"]
      }
    ]
  }
];

/**
 * Get states for a specific country
 */
export const getStatesByCountry = (countryCode: string): State[] => {
  const country = locationData.find(c => c.code === countryCode);
  return country?.states || [];
};

/**
 * Get cities for a specific state in a country
 */
export const getCitiesByState = (countryCode: string, stateCode: string): string[] => {
  const country = locationData.find(c => c.code === countryCode);
  const state = country?.states.find(s => s.code === stateCode);
  return state?.cities || [];
};

/**
 * Get country name by code
 */
export const getCountryName = (countryCode: string): string => {
  const country = locationData.find(c => c.code === countryCode);
  return country?.name || countryCode;
};

/**
 * Get state name by code
 */
export const getStateName = (countryCode: string, stateCode: string): string => {
  const country = locationData.find(c => c.code === countryCode);
  const state = country?.states.find(s => s.code === stateCode);
  return state?.name || stateCode;
};

/**
 * Search cities across all countries
 */
export const searchCities = (query: string): { country: string; state: string; city: string }[] => {
  const results: { country: string; state: string; city: string }[] = [];
  const lowerQuery = query.toLowerCase();

  locationData.forEach(country => {
    country.states.forEach(state => {
      state.cities.forEach(city => {
        if (city.toLowerCase().includes(lowerQuery)) {
          results.push({
            country: country.name,
            state: state.name,
            city
          });
        }
      });
    });
  });

  return results;
};



