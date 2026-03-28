import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Storage "blob-storage/Storage";

module {
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

  type Actor = {
    nextId : Nat;
    apps : Map.Map<Nat, App>;
  };

  public func run(_old : {}) : Actor {
    {
      apps = Map.empty<Nat, App>();
      nextId = 0;
    };
  };
};
