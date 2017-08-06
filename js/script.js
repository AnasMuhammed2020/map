//show and unshow the list
var viewModel = function () {
    var self = this;
    this.search = ko.observable("");
    this.current = ko.observable(false);
    this.change = function () {
        if (self.current()) {
            self.current(false);
        } else {
            self.current(true);
        }
    };
    //list of all markers
    this.marklist1 = ko.observableArray([]);
    //list when using filter
    this.marksearch = ko.observableArray([]);
    this.marklist = [{
            id: 1,
            name: "Downtown mall",
            lat: 30.017631,
            lng: 31.413011
        },
        {
            id: 2,
            name: "Azhar univeristy",
            lat: 30.054632,
            lng: 31.315669
        },
        {
            id: 3,
            name: "Al Hayy Ath Thamin",
            lat: 30.058606,
            lng: 31.354984
        },
        {
            id: 4,
            name: "Al Wafaa W Al Amal City",
            lat: 30.039884,
            lng: 31.348632
        },
        {
            id: 5,
            name: "International Garden",
            lat: 30.049171,
            lng: 31.334213
        },
        {
            id: 6,
            name: "Cairo Festival Mall",
            lat: 30.028962,
            lng: 31.408568
        },
        {
            id: 7,
            name: "IKEA - Cairo",
            lat: 30.029558,
            lng: 31.407232
        }

    ];
    // filter
    this.filterList = function () {
        var input = self.search();
        self.marksearch([]);
        for (var i = 0; i < self.marklist1.length; i++) {
            if (self.marklist1[i].title.toUpperCase().includes(input.toUpperCase())) {
                self.marksearch.push({
                    id: self.marklist1[i].id,
                    name: self.marklist1[i].title
                });
                self.marklist1[i].setMap(map);

            } else {
                self.marklist1[i].setMap(null);
            }
        }
    };
    this.marklist1 = [];
    this.search.subscribe(function () {
        self.filterList();
    });
    this.showInfo = function(Item) {
        popinfo(self.marklist1[Item.id]);
    };

};

var marker;
var map;
var i;
var infowindow;
//using foursquare API
function popinfo(marker1) {
    var con = "<h3>" + marker1.title + "</h3><br>";
    marker1.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(function () {
        marker1.setAnimation(null);
    }, 2100);
    $.ajax({
        url: "https://api.foursquare.com/v2/venues/search?ll=" + marker1.position.lat() + ',' + marker1.position.lng() + "&oauth_token=L1KVZLECPYXDWDBBPOCYW3BSZJZDSPKOPVMFEQ14WNZYK0Y5&v=20170729",
        success: function (response) {
            vlist = response.response.venues;
            for (var i = 0; i < vlist.length; i++) {
                var address = "";
                if (vlist[i].location.formattedAddress) address = vlist[i].location.formattedAddress[0];
                con += vlist[i].name + "<br>" + address + "<br><hr>";
                infowindow.marker = marker1;
                infowindow.setContent(con);
                infowindow.open(map, marker1);
                infowindow.location = marker1.position;
                if (i == 2) break;
            }
            setTimeout(function () {
                marker1.setAnimation(null);
            }, 2100);
        },
        error: function () {
            con += "faild to get nearby venues";
            infowindow.marker = marker1;
            infowindow.setContent(con);
            infowindow.open(map, marker1);
            infowindow.location = marker1.position;
            setTimeout(function () {
                marker1.setAnimation(null);
            }, 2100);
        }
    });
}

// the map 
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 30.041891,
            lng: 31.368226
        },
        zoom: 13
    });
    var bounds = new google.maps.LatLngBounds();
    infowindow = new google.maps.InfoWindow();
    for (i = 0; i < myview.marklist.length; i++) {
        marker = new google.maps.Marker({
            position: {
                lat: myview.marklist[i].lat,
                lng: myview.marklist[i].lng
            },
            id: i,
            map: map,
            title: myview.marklist[i].name
        });
        myview.marklist1.push(marker);


        bounds.extend({
            lat: myview.marklist[i].lat,
            lng: myview.marklist[i].lng
        });
    }


    function callpop() {
        popinfo(this);
    }
    //show all the list
    for (i = 0; i < myview.marklist1.length; i++) {
        myview.marklist1[i].addListener('click', callpop);
    }
    myview.filterList();
    map.fitBounds(bounds);
    google.maps.event.addDomListener(window, 'resize', function () {
        map.fitBounds(bounds);
    });
}

function mapError() {
    alert("can not load map");
}
var myview = new viewModel();
ko.applyBindings(myview);