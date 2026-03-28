import Array "mo:core/Array";
import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Order "mo:core/Order";
import Time "mo:core/Time";
import Migration "migration";
import Float "mo:core/Float";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";

(with migration = Migration.run)
actor {
  include MixinStorage();

  type Blob = Storage.ExternalBlob;

  type App = {
    id : Nat;
    name : Text;
    logo : Blob;
    downloadLink : Text;
    hot : Bool;
    stars : Float;
    version : Text;
    createdAt : Int;
  };

  var nextId = 0;
  let apps = Map.empty<Nat, App>();

  func compareAppsByIdDescending(a : App, b : App) : Order.Order {
    Nat.compare(b.id, a.id);
  };

  public shared ({ caller }) func addApp(name : Text, logo : Blob, downloadLink : Text, hot : Bool, stars : Float, version : Text) : async Nat {
    let id = nextId;
    let app : App = {
      id;
      name;
      logo;
      downloadLink;
      hot;
      stars;
      version;
      createdAt = Time.now();
    };
    apps.add(id, app);
    nextId += 1;
    id;
  };

  public shared ({ caller }) func removeApp(id : Nat) : async Bool {
    if (not apps.containsKey(id)) {
      return false;
    };
    apps.remove(id);
    true;
  };

  public query ({ caller }) func getApps() : async [App] {
    let appsArray = apps.values().toArray();
    appsArray.sort(compareAppsByIdDescending);
  };

  public shared ({ caller }) func updateApp(id : Nat, name : Text, logo : Blob, downloadLink : Text, hot : Bool, stars : Float, version : Text) : async Bool {
    switch (apps.get(id)) {
      case (null) { false };
      case (?app) {
        let updatedApp : App = {
          id = app.id;
          name;
          logo;
          downloadLink;
          hot;
          stars;
          version;
          createdAt = app.createdAt;
        };
        apps.add(id, updatedApp);
        true;
      };
    };
  };

  public query ({ caller }) func searchApps(term : Text) : async [App] {
    apps.values().toArray().filter(func(app) { app.name.contains(#text term) });
  };
};
