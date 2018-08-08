/**
 * Common database helper functions.
 */
var dbPromise;
class DBHelper {
  /**
   * Database URL.
   * Change this to restaurants.json file location on your server.
   */
  static get DATABASE_URL() {
    const port = 1337; // Change this to your server port
    return `http://localhost:${port}/restaurants`;
  }

  static openDb() {
    return idb.open("restv1Db", 1, upgradeDB => {
      upgradeDB.createObjectStore("restaurants", {
        keyPath: "id"
      });
    });
  }

  // add restaurants to opened IDB
  static addRest() {
    dbPromise = DBHelper.openDb();
    fetch(DBHelper.DATABASE_URL)
      .then(res => res.json())
      .then(restaurants => {
        dbPromise.then(db => {
          let tx = db.transaction("restaurant", "readwrite");
          let store = tx.objectStore("restaurants");
          restaurants.forEach(restaurant => {
            store.put(restaurant);
          });
        });
        callback(null, restaurants);
      })
      .catch(err => {
        dbPromise.then(db => {
          let tx = db.transaction("restaurants");
          let store = tx.objectStore("restaurants");
          return store.getAll();
        });
      });
  }

  // get specific restaurant
  static getID(id) {
    return dbPromise
      .then(db => {
        const tx = db.transaction("restaurants", "readonly");
        const store = tx.objectStore("restaurants");
        return store.get(parseInt(id));
      })
      .then(restaurantObject => {
        return restaurantObject;
      })
      .catch(function(e) {
        console.log(`ERROR: ${e}`);
      });
  }

  // get values for store
  static getAll() {
    dbPromise
      .then(db => {
        return db
          .transaction("restaurants")
          .objectStore("restaurants")
          .getAll();
      })
      .then(restaurants => console.log(restaurants));
  }

  /**
   * Fetch all restaurants.
   */
  static fetchRestaurants(callback) {
    // callback will get instance of restaurants
    DBHelper.addRest(callback);
    // if no restaurants fetch from server
    if (!restaurants) {
      fetch(DBHelper.DATABASE_URL)
        .then(res => {
          if (!res) {
            return;
          } else {
            res.json().then(data => {
              const restaurants = data;
              callback(null, restaurants);
            });
          }
        })
        .catch(err => {
          callback(err, null);
          console.log(`Fetch Error: ${err}`);
        });
    }
  }

  /**
   * Fetch a restaurant by its ID.
   */
  static fetchRestaurantById(id, callback) {
    // fetch all restaurants with proper error handling.
    // returns instance of a restaurant object from the array
    let restaurant = DBHelper.getID(id);
    restaurant.then(restaurant => {
      // if we have valid response pass to callback
      if (restaurant) {
        callback(null, restaurant);
        return;
      } else {
        // fetch from not work if we dont have response
        DBHelper.fetchRestaurants((error, restaurants) => {
          if (error) {
            callback(error, null);
          } else {
            const restaurant = restaurants.find(
              (obj, index) => obj["id"] === index + 1
            );
            if (restaurant) {
              // Got the restaurant
              callback(null, restaurant);
            } else {
              // Restaurant does not exist in the database
              callback("Restaurant does not exist", null);
            }
          }
        });
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine type with proper error handling.
   */
  static fetchRestaurantByCuisine(cuisine, callback) {
    // Fetch all restaurants  with proper error handling
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given cuisine type
        const results = restaurants.filter(r => r.cuisine_type == cuisine);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a neighborhood with proper error handling.
   */
  static fetchRestaurantByNeighborhood(neighborhood, callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Filter restaurants to have only given neighborhood
        const results = restaurants.filter(r => r.neighborhood == neighborhood);
        callback(null, results);
      }
    });
  }

  /**
   * Fetch restaurants by a cuisine and a neighborhood with proper error handling.
   */
  static fetchRestaurantByCuisineAndNeighborhood(
    cuisine,
    neighborhood,
    callback
  ) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        let results = restaurants;
        if (cuisine != "all") {
          // filter by cuisine
          results = results.filter(r => r.cuisine_type == cuisine);
        }
        if (neighborhood != "all") {
          // filter by neighborhood
          results = results.filter(r => r.neighborhood == neighborhood);
        }
        callback(null, results);
      }
    });
  }

  /**
   * Fetch all neighborhoods with proper error handling.
   */
  static fetchNeighborhoods(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all neighborhoods from all restaurants
        const neighborhoods = restaurants.map(
          (v, i) => restaurants[i].neighborhood
        );
        // Remove duplicates from neighborhoods
        const uniqueNeighborhoods = neighborhoods.filter(
          (v, i) => neighborhoods.indexOf(v) == i
        );
        callback(null, uniqueNeighborhoods);
      }
    });
  }

  /**
   * Fetch all cuisines with proper error handling.
   */
  static fetchCuisines(callback) {
    // Fetch all restaurants
    DBHelper.fetchRestaurants((error, restaurants) => {
      if (error) {
        callback(error, null);
      } else {
        // Get all cuisines from all restaurants
        const cuisines = restaurants.map((v, i) => restaurants[i].cuisine_type);
        // Remove duplicates from cuisines
        const uniqueCuisines = cuisines.filter(
          (v, i) => cuisines.indexOf(v) == i
        );
        callback(null, uniqueCuisines);
      }
    });
  }

  /**
   * Restaurant page URL.
   */
  static urlForRestaurant(restaurant) {
    return `./restaurant.html?id=${restaurant.id}`;
  }

  /**
   * Restaurant image URL.
   */
  static imageUrlForRestaurant(restaurant) {
    return `img/${restaurant.id}.jpg`;
  }

  /**
   * Restaurant alt description.
   */
  static altForRestaurant(restaurant) {
    return `${restaurant.alt}`;
  }

  /**
   * Map marker for a restaurant.
   */
  static mapMarkerForRestaurant(restaurant, map) {
    const marker = new google.maps.Marker({
      position: restaurant.latlng,
      title: restaurant.name,
      url: DBHelper.urlForRestaurant(restaurant),
      map: map,
      animation: google.maps.Animation.DROP
    });
    return marker;
  }
}
