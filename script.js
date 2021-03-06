var auth2;

var signInButton;
var signOutButton;

var isOpen = false;
var isBin = false;
var clicked = [];
var videoBlurred = true;
var snakeShown = false;

var google_profile;
var pikapp_user = {};
var signInCode = "";

var attendance_sheet_entries;
var today_attendance;

var error_try_later =
  "<br><br>Please try again later.<br>* If the error persists, please contact the chapter secretary for assistance";

// Make sure it is public or set to Anyone with link can view
var accounts_sheet =
  "https://sheets.googleapis.com/v4/spreadsheets/1F5AbJiDq2kmPA0am1qss23Hnt-Vz7woKBY1SEVShSBM/values/Accounts?key=AIzaSyCrC8oMBTDJak8KW0dzZgKdy1DRu3B4AsI";
var announcements_sheet =
  "https://sheets.googleapis.com/v4/spreadsheets/1F5AbJiDq2kmPA0am1qss23Hnt-Vz7woKBY1SEVShSBM/values/Announcements?key=AIzaSyCrC8oMBTDJak8KW0dzZgKdy1DRu3B4AsI";
var today_sheet =
  "https://sheets.googleapis.com/v4/spreadsheets/1F5AbJiDq2kmPA0am1qss23Hnt-Vz7woKBY1SEVShSBM/values/Today?key=AIzaSyCrC8oMBTDJak8KW0dzZgKdy1DRu3B4AsI";
// var exec_sheet =
//   "https://sheets.googleapis.com/v4/spreadsheets/1F5AbJiDq2kmPA0am1qss23Hnt-Vz7woKBY1SEVShSBM/values/Exec?key=AIzaSyCrC8oMBTDJak8KW0dzZgKdy1DRu3B4AsI";
// var committees_sheet =
//   "https://sheets.googleapis.com/v4/spreadsheets/1F5AbJiDq2kmPA0am1qss23Hnt-Vz7woKBY1SEVShSBM/values/Committees?key=AIzaSyCrC8oMBTDJak8KW0dzZgKdy1DRu3B4AsI";
var codes_sheet =
  "https://sheets.googleapis.com/v4/spreadsheets/1F5AbJiDq2kmPA0am1qss23Hnt-Vz7woKBY1SEVShSBM/values/Codes?key=AIzaSyCrC8oMBTDJak8KW0dzZgKdy1DRu3B4AsI";
var attendence_sheet_url =
  "https://sheets.googleapis.com/v4/spreadsheets/1F5AbJiDq2kmPA0am1qss23Hnt-Vz7woKBY1SEVShSBM/values/Overview?key=AIzaSyCrC8oMBTDJak8KW0dzZgKdy1DRu3B4AsI";

window.onload = function (e) {
  this.console.log("Loaded window");
  auth2 = gapi.auth2.getAuthInstance();

  console.log(window.location.pathname);
  // var video = document.getElementById("vid");
  // video.addEventListener(
  //   "loadedmetadata",
  //   function () {
  //     video.currentTime = Math.random() * video.duration;
  //   },
  //   false
  // );
};

function refreshAttendance() {
  $.getJSON(today_sheet, function (data) {
    today_attendance = data.values;

    console.log(today_attendance);


    var signed_in_today_1_element = document.getElementById(
      "signed_in_today_1"
    );
    var signed_in_today_2_element = document.getElementById(
      "signed_in_today_2"
    );

    var today_header_element = document.getElementById("today_header");
    var missing_members_element = document.getElementById("missing_members");


    var signed_in_count = 0;
    if (today_attendance.length > 1) {
      missing_members_element.innerHTML = "";



      for (var i = 0; i < attendance_sheet_entries.length; i++) {

        if (attendance_sheet_entries[i][0].indexOf("@") != -1) {

          var found = false;

          for (var j = 0; j < today_attendance.length; j++) {
            if (today_attendance[j][1] != null &&
              today_attendance[j][1].indexOf("@") != -1 &&
              today_attendance[j][1] == attendance_sheet_entries[i][0]
            ) {
              found = true;
              signed_in_count++;
            }
          }
          if (found == false) {
            missing_members_element.innerHTML +=
              "- " +
              attendance_sheet_entries[i][1] +
              " " +
              attendance_sheet_entries[i][2] +
              "<br>";
          } else {}
        }
      }
    } else {
      today_header_element.innerHTML = "LAST EVENT";
      missing_members_element.innerHTML = "- No one signed in yet today";
      signed_in_today_1_element.innerHTML = "- No one signed in yet today";
      signed_in_today_1_element.style.display = "none";
      signed_in_today_2_element.innerHTML = "- No one signed in yet today";
    }



    var total_members_count = attendance_sheet_entries.length - 2;

    var signed_in_perc = (
      (signed_in_count / total_members_count) *
      100
    ).toFixed(2);
    var signed_in_today_text =
      signed_in_count +
      " out of " +
      total_members_count +
      " (" +
      signed_in_perc +
      "%)";
    console.log(signed_in_today_text);
    signed_in_today_1_element.style.display = "block";
    signed_in_today_1_element.innerHTML = signed_in_today_text;
    signed_in_today_2_element.innerHTML = "- " + signed_in_today_text;
  });
}

function tickets() {
  alert(
    "Group Info:\n\nUser: Bsheppa1\nPassword: pikapp2019\n\nClick below to continue to the Ticket Portal"
  );
}

function confirmLocation() {
  alert(
    "IMPORTANT!\n\n* If asked, please allow location access on the next screen to skip having to enter the Secret Code\n\nMake sure to sign in using your UTK email address (@vols.utk.edu)\nPress the button below to continue..."
  );
  getLocation();
}

function checkLocation(position) {
  console.log(position.coords.latitude);
  console.log(position.coords.longitude);
  if (
    position.coords.latitude > 35.948528 - 0.0005 &&
    position.coords.latitude < 35.948528 + 0.0005 &&
    position.coords.longitude > -83.931735 - 0.0005 &&
    position.coords.longitude < -83.931735 + 0.0005
  ) {
    console.log("Filling in code");
    redirectSignIn(signInCode);
  } else {
    redirectSignIn();
  }
}

function getLocation() {
  console.log("Checking location");
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(checkLocation, showError);
  } else {
    console.log("Geolocation is not supported by this browser.");
    redirectSignIn();
  }
}

function redirectSignIn(code = "") {
  window.location.href =
    "https://docs.google.com/forms/d/e/1FAIpQLSf7c8D_wwBKNMdJS7z6jJ-rdOcmv1LAHKo9SPgk0jgX92uEzQ/viewform?usp=pp_url&entry.248598887=" +
    google_profile.getGivenName() +
    "&entry.1123381156=" +
    google_profile.getFamilyName() +
    "&entry.594337284=" +
    code;
}

function showError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      alert(
        "User denied GeoLocation Access\n\nIf you'd like to use this feature, please check your device/browser settings to ensure that Location Services are enabled.\n\nClick below to continue"
      );
      break;
    case error.POSITION_UNAVAILABLE:
      alert("Location information is unavailable.\n\nClick below to continue");
      break;
    case error.TIMEOUT:
      alert(
        "The request to get user location timed out.\n\nClick below to continue"
      );
      break;
    case error.UNKNOWN_ERROR:
      alert("An unknown error occurred.\n\nClick below to continue");
      break;
  }
  redirectSignIn();
}

function toggle(source) {
  if (auth2.isSignedIn.get()) {
    for (var i = 1; i < source.parentNode.children.length; i++) {
      if (
        source.parentNode.children[i].style.display == "none" &&
        source.parentNode.children[i].id != "loggedoffMenu"
      ) {
        source.parentNode.children[i].style.display = "block";
      } else {
        source.parentNode.children[i].style.display = "none";
      }
    }
  }
}

function onFailure() {
  document.getElementById("loading").style.display = "none";
  alert("Google Sign-in Dialog closed by user.");
}

function loadMembersTab() {
  // $.getJSON(exec_sheet, function (data) {
  //   var entry = data.values;
  //   for (var i = 1; i < entry.length; i++) {
  //     document.getElementById("exec_members").innerHTML +=
  //       "<div><h1>" +
  //       entry[i][2] +
  //       "</h1><b>" +
  //       entry[i][0] +
  //       " " +
  //       entry[i][1] +
  //       "</b><a class='nobold' href='mailto:" +
  //       entry[i][3] +
  //       "'>" +
  //       "Email" +
  //       "</a></div>";
  //   }
  // });
  $.getJSON(accounts_sheet, function (data) {
    var entry = data.values;
    for (var i = 1; i < entry.length; i++) {
      if (entry[i][6] != undefined && entry[i][5] == "ACTIVE") {
        // var url= entry[i][24]
        // var url_id = url.split("?id=");
        // console.log(url_id[1])
        // alert(entry[i][0]);
        if (entry[i][0] == "jmize3@vols.utk.edu") {

          entry[i][11] += " Alcoholic";
        }
        document.getElementById("all_members").innerHTML +=
          "<div>" +
          // "<img src='https://drive.google.com/uc?export=view&id=" +
          // url_id[1] +
          // "'>" +
          "<h1>" +
          entry[i][7] +
          " " +
          entry[i][8] +
          "</h1><b>" +
          entry[i][10] +
          " " +
          entry[i][11] +
          " Class</b>" +
          entry[i][13] +
          "<i>" +
          entry[i][14] +
          "</i></div>";
      }
    }
  });
}

// function loadCommitteesTab() {
//   $.getJSON(committees_sheet, function (data) {
//     var entry = data.values;
//     for (var i = 1; i < entry.length; i++) {
//       for (var h = 0; h < entry[0].length; h++) {
//         if (
//           entry[0][h].indexOf("Committee") != -1 &&
//           entry[0][h].indexOf("Name") != -1
//         ) {
//           if (entry[i][h] != null) {
//             document.getElementById("committees_inner").innerHTML +=
//               "<div class='center'><h1>" +
//               entry[i][h] +
//               "</h1><b>Run by " +
//               entry[i][h + 1] +
//               "</b>About: " +
//               entry[i][h + 2] +
//               "</div>";
//           }
//         }
//       }
//     }
//   });
// }

function check_announcements() {
  console.log("Checking announcements");
  $.getJSON(announcements_sheet, function (data) {
    var entry = data.values;

    var popup_title = "";
    var popup_body = "";
    var popup_link = "";
    var popup_author = "";
    console.log("HERE")
    for (var i = 1; i < entry.length; i++) {

      try {
        if (entry[i][4].indexOf("POPUP") != -1) {
          console.log("Found matchind popup");
          var entry_date = entry[i][9].split("/");

          var date = new Date();
          if (
            entry_date[0] == date.getMonth() + 1 &&
            entry_date[1] == date.getDate() &&
            entry_date[2] == date.getFullYear()
          ) {
            console.log("Found matching date");
            popup_title = entry[i][6];
            popup_body = entry[i][7];
            popup_link = entry[i][8];
            popup_author = entry[i][1];
          }
        }
      } catch (e) {
        console.log("Err retrieving announcement " + i)
      }
    }
    if (popup_title != "" && popup_body != "" && popup_author != "") {
      var message =
        popup_title +
        "\n\n" +
        popup_body +
        "\n" +
        " - by " +
        popup_author +
        "\n\n";
      if (popup_link == "") {
        window.alert(message + "* Click OK to continue");
      } else {
        if (
          window.confirm(
            message +
            // "Link: " +
            // popup_link +
            // "\n" +

            "* Click OK to proceed to the link.\n* CANCEL to dismiss this message.\n" +
            "Don't forget to sign in to any mandatory events after visiting the following page."
          )
        ) {
          if (popup_link != "") {
            window.location.href = popup_link;
          }
        } else {
          // DO NOTHING
        }
      }
    }
  });
}

function validate_account(callback) {
  console.log("Validating account with database");

  $.getJSON(accounts_sheet, function (data) {
    var entry = data.values;

    if (entry == undefined) {
      alert(
        "Error!\nCouldn't log you in.\nPlease try again later.\nIf the error persists, please contact the chapter secretary for assistance."
      );
      location.href = "/";
    }
    validated = false;

    for (var i = 0; i < entry.length; i++) {
      if (google_profile.getEmail() == entry[i][0]) {
        console.log("Found account");
        console.log(entry[i]);
        pikapp_user.entry = entry[i];
        validated = true;

        pikapp_user.is_setup = parseInt(entry[i][1]);

        if (!pikapp_user.is_setup) {
          console.log("Account isn't set up.");
          if (entry[i][6] == "") {
            alert(
              "Welcome to Alpha Sigma!\n\nIt seems like this is your first time logging in to your Member Portal. Let's get you familiar with it.\nThe Member Portal is your prime stop for everything PiKapp. It's where you sign in for all required events, check your attendance, submit excuses, view the calendar, run for elections, view the chapter roster, and much more!\n\nBefore continuing, let's finish setting up your profile. Then, take a look at what your Member Portal has to offer.\n* Click the button below to proceed."
            );
          } else {
            alert(
              "Welcome back, " +
              entry[i][7] +
              "!\n\nIt's time for you to update your Member Profile information!\n\nYou MUST complete this step first before continuing to your Member Portal. After you're done, please come back to this page to continue\n* Click the button below to proceed."
            );
          }

          signOut();

          window.location.href =
            "https://docs.google.com/forms/d/e/1FAIpQLSe4cBr3TViWjPS8p0RTcxefbaJzDZDNEVBO9OFBlUpbVKyIdQ/viewform";

          return;
        }

        pikapp_user.status = entry[i][5];


        if (pikapp_user.status != "ACTIVE") {
          alert(
            "Hello, " +
            entry[i][7] +
            "!\n\nAccount status: " + pikapp_user.status + "\nIf you think this is an error, please contact the chapter secretary for assistance.\n\nLogging you out..."
          );

          signOut();

          return;
        }
        pikapp_user.is_admin = parseInt(entry[i][2]);
        pikapp_user.is_owner = parseInt(entry[i][3]);
        pikapp_user.is_excused = parseInt(entry[i][4]);

        callback();
        break;
      } else {}
    }
    if (!validated) {
      show_loading(false);
      console.log("Account not found");
      if (google_profile.getEmail().indexOf("@vols.utk.edu") != -1) {
        console.log("UT email address. Showing account creation.");
        signInButton.style = "display:none;";
        signOutButton.style = "display:block;";
        helpText.innerHTML =
          "Email: " +
          google_profile.getEmail() +
          "<br>You don't appear to be a member of the Alpha Sigma chapter yet.";
        document.getElementById("createAccount").style = "display:block;";
      } else {
        console.log("Not a UT email address.");
        alert("Please sign in with an UT email address.\nSigning you out.");
        signOut();
        return;
      }
    }
  }).fail(function () {
    signOut();
    alert(
      "An unexpected error occured signing you in.\n\nPlease try again later\nIf the problem persists, please contact the chapter secretary for assistance."
    );
  });
}

function initialize_elements() {
  signInButton = document.getElementById("gBtn");
  signOutButton = document.getElementById("signout");
}

function show_loading(should_load) {
  if (should_load) {
    document.getElementById("loading").style.display = "block";
  } else {
    document.getElementById("loading").style.display = "none";
  }
}

function onSignIn(googleUser) {
  // Useful data for your client-side scripts:

  if (window.location.pathname.indexOf("portal") == -1) {
    window.location.href = "http://utkpikapp.org/portal";
  }

  console.log(googleUser);

  show_loading(true);
  google_profile = googleUser.getBasicProfile();
  console.log("ID: " + google_profile.getId()); // Don't send this directly to your server!
  console.log("Full Name: " + google_profile.getName());
  console.log("Given Name: " + google_profile.getGivenName());
  console.log("Family Name: " + google_profile.getFamilyName());
  console.log("Image URL: " + google_profile.getImageUrl());
  console.log("Email: " + google_profile.getEmail());
  // The ID token you need to pass to your backend:
  var id_token = googleUser.getAuthResponse().id_token;
  console.log("ID Token: " + id_token);

  initialize_elements();

  check_announcements();
  validate_account(function () {
    console.log(pikapp_user.entry);
    todoFunction();
  });

  // $.getJSON(accounts_sheet, function (data) {
  //   var entry = data.values;
  //   //console.log(entry);
  //   if (entry == undefined) {
  //     alert("Error!\nCouldn't log you in.\nPlease try again later.\nIf the error persists, please contact the chapter secretary for assistance.");
  //     location.href = "/";
  //   }

  //
  // }).fail(function () {
  //   signOut();
  //   alert(
  //     "An unexpected error occured signing you in.\n\nPlease try again later\nIf the problem persists, please contact the chapter secretary for assistance"
  //   );
  // });
}

function todoFunction() {
  var info = document.getElementById("info");
  var img = document.getElementById("profile_pic");
  img.style.display = "block";
  var helpText = document.getElementById("helpText");
  if (validated) {
    var editProfileButton = document.getElementById("btn_profile");
    editProfileButton.style.display = "block";
    if (editProfileButton.href.indexOf("entry") == -1) {
      editProfileButton.href +=
        "?usp=pp_url&entry.289015268=" +
        pikapp_user.entry[7] +
        "&entry.121518091=" +
        pikapp_user.entry[8] +
        "&entry.1347198033=" +
        pikapp_user.entry[9] +
        "&entry.662107591=" +
        pikapp_user.entry[10] +
        "&entry.1544953760=" +
        pikapp_user.entry[11] +
        "&entry.1909659683=" +
        pikapp_user.entry[12] +
        "&entry.1730843126=" +
        pikapp_user.entry[13] +
        "&entry.860463443=" +
        pikapp_user.entry[14] +
        "&entry.470070660=" +
        pikapp_user.entry[15] +
        "&entry.499866465=" +
        pikapp_user.entry[16] +
        "&entry.968397117=" +
        pikapp_user.entry[17] +
        "&entry.1730056655=" +
        pikapp_user.entry[18] +
        "&entry.1783386910=" +
        pikapp_user.entry[19] +
        "&entry.684013321=" +
        pikapp_user.entry[20] +
        "&entry.1837258615=" +
        pikapp_user.entry[21] +
        "&entry.813408308=" +
        pikapp_user.entry[22];
    }

    // TODO - USE FOR LOOP TO SET ALL ELEMENTS VISIBLE EXCEPT ADMIN MENU
    var menu = document.getElementById("section_home");
    menu.style = "visibility: visible;";
    var attendance_section = document.getElementById("section_attendance");
    attendance_section.style = "visibility: visible;";
    var announcements_section = document.getElementById(
      "section_announcements"
    );
    announcements_section.style = "visibility: visible;";
    var calendar_section = document.getElementById("section_calendar");
    calendar_section.style = "visibility: visible;";
    var members_section = document.getElementById("section_members");
    members_section.style = "visibility: visible;";
    // var committees_section = document.getElementById("section_committees");
    // committees_section.style = "visibility: visible;";

    signInButton.style = "display:none;";

    if (pikapp_user.is_owner) {
      var adminMenu = document.getElementById("section_admin");
      adminMenu.style = "display:visible;";

      var ownerMenu = document.getElementById("ownerMenu");
      ownerMenu.style = "display:visible;";
    } else if (pikapp_user.is_admin) {
      var adminMenu = document.getElementById("section_admin");
      adminMenu.style = "display:visible;";
    }
    signOutButton.style = "display:block;";

    var lastCodeRow;
    var codes;
    $.getJSON(codes_sheet, function (data) {
      codes = data.values;

      if (codes.length != 1) {
        lastCodeRow = codes[codes.length - 1];

        info.innerHTML +=
          "<br><b>** Mandatory " +
          lastCodeRow[2] +
          " on " +
          lastCodeRow[0].split(" ")[0] +
          " **</b>";

        var event_name_element = document.getElementById("event_name");
        event_name_element.innerHTML = lastCodeRow[2] + " on " + lastCodeRow[0].split(" ")[0];
        signInCode = lastCodeRow[lastCodeRow.length - 1];
      }

      var report_element = document.getElementById("table");

      $.getJSON(attendence_sheet_url, function (data) {
        attendance_sheet_entries = data.values;
        var header = attendance_sheet_entries[0];

        var report_element = document.getElementById("table");

        var overview_sheet_index = -1;
        for (var i = 2; i < attendance_sheet_entries.length; i++) {
          if (attendance_sheet_entries[i][0] == google_profile.getEmail()) {
            console.log("Found in overview");
            overview_sheet_index = i;
            break;
          }
        }

        if (overview_sheet_index == -1) {
          report_element.innerHTML =
            "You don't have any new reports yet!<br>Sign in to mandatory chapter events and check back later.<br><br>If you think this is an error, please try again later or contact the chapter secretary for assistance.";
        } else {
          refreshAttendance();
          setInterval(refreshAttendance, 5000);

          var account_entry = attendance_sheet_entries[overview_sheet_index];
          var email = account_entry[0];
          // TO PUT BACK account_entry.splice(0, 3);

          report_element.innerHTML = "Report for: " + email + "<br>";
          var time_updated = attendance_sheet_entries[1][0].split(" ")[5];
          var time_updated_split = time_updated.split(":");
          var time_updated_hour = parseInt(time_updated_split[0]);
          if (time_updated_hour > 12) {
            time_updated =
              time_updated_hour - 12 + ":" + time_updated_split[1] + "PM";
          } else {
            time_updated =
              time_updated_split[0] + ":" + time_updated_split[1] + "AM";
          }

          report_element.innerHTML +=
            "Last Updated: " + time_updated + " (Updated hourly)<br>";
          //report_element.innerHTML += "Missed dates:<br>"
          var displayNoMissed = false;

          var percent_attended = (
            (account_entry[header.indexOf("Attended")] /
              account_entry[header.indexOf("Total")]) *
            100
          ).toFixed(2);
          for (var i = 3; i < header.length; i++) {
            title = "";
            if (header[i].indexOf("/") == -1) {
              switch (header[i]) {
                case "Attended":
                  header[i] = "# " + header[i].toUpperCase();
                  break;
                case "Left":
                  header[i] = "# REMAINING PASSES";
                  break;
                case "Total":
                  header[i] = "- Total Events";
                  break;
                case "Unexcused":
                  header[i] = "# " + header[i].toUpperCase();

                  if (account_entry[i] == 0) {
                    displayNoMissed = true;
                  } else {
                    displayNoMissed = false;
                  }
                  break;
                case "Fine":
                  header[i] = "* " + header[i].toUpperCase();

                  account_entry[i] += "<br>";
                  break;
                default:
                  header[i] = "- " + header[i];
              }
              report_element.innerHTML +=
                header[i] +
                ": " +
                (header[i].indexOf("Attended") != -1 ?
                  account_entry[i] + " (" + percent_attended + "%)" :
                  account_entry[i]) +
                "<br>";
            } else {
              if (
                account_entry[i] == "P_EXC" ||
                account_entry[i] == "EXC" ||
                account_entry[i] == "OK" ||
                account_entry[i] == "1"
              ) {
                // do nothing
              } else {
                console.log("here");
                for (var x = 1; x < codes.length; x++) {
                  if (codes[x][0].split(" ")[0] == header[i]) {
                    title = codes[x][2];
                    break;
                  }
                }

                var date = header[i].split("/");
                if (date[0].length == 1) {
                  date[0] = "0" + date[0];
                }
                if (date[1].length == 1) {
                  date[1] = "0" + date[1];
                }
                header[i] = date[0] + "/" + date[1] + "/" + date[2];

                if (account_entry[i] == "0") {
                  account_entry[i] = "** Missed";
                }
                if (account_entry[i] == "PASS") {
                  account_entry[i] = "** PASS";
                }
                account_entry[i] += " - " + title;
                report_element.innerHTML +=
                  header[i] + ": " + account_entry[i] + "<br>";
              }
            }
          }

          if (displayNoMissed) {
            report_element.innerHTML +=
              "Looking good!<br>You have 0 missed events so far!";
          } else {
            report_element.innerHTML +=
              "<br>* IMPORTANT: You are personally responsible to contact the secretary within the next few days if there are any errors with your attendence. Fines are to be put in a week after missing a required event.";
          }
        }

        document.getElementById("loading").style.display = "none";
      }).fail(function () {
        report_element.innerHTML =
          "An unexpected error occured fetching your attendance report." +
          error_try_later;
      });
    });

    var menuLoggedOff = document.getElementById("loggedoffMenu");
    menuLoggedOff.style = "display: none;";

    info.innerHTML =
      "Name: " +
      google_profile.getName() +
      "<br>Email: " +
      google_profile.getEmail() +
      "<br>Status: " +
      (pikapp_user.is_owner ?
        "Owner" :
        pikapp_user.is_admin ?
        "Admin" :
        "Member") +
      (pikapp_user.is_setup ?
        "" :
        "") /*TODO". Click below to set up your account"*/ ;

    img.src = google_profile.getImageUrl();

    loadMembersTab();
    // loadCommitteesTab();

    var excuseButton = document.getElementById("excuseButton");
    if (excuseButton.href.indexOf("entry") == -1) {
      excuseButton.href +=
        "?entry.191386322=" +
        google_profile.getGivenName() +
        "&entry.908237995=" +
        google_profile.getFamilyName();
    }
    if (pikapp_user.is_excused) {
      document.getElementById("chapterHint").innerHTML +=
        "<br>* INFO: You are currently set as perma-excused from mandatory events.";
    }
  } else {
    show_loading(false);
  }
}

function signOut() {
  console.log("Signing out!");
  auth2 = gapi.auth2.getAuthInstance();

  auth2.signOut().then(function () {
    console.log("User signed out.");
    show_loading(false);

    signOutButton.style = "display:none;";
    signInButton.style = "display:block;";
    helpText.innerHTML =
      "Sign In with your UT account to get access to all member features.";

    document.getElementById("profile_pic").style.display = "none";
    // document.getElementById("editButton").style.display = "none";

    document.getElementById("section_home").style.display = "none";
    // document.getElementById("section_committees").style.display = "none";
    document.getElementById("section_attendance").style.display = "none";
    document.getElementById("section_calendar").style.display = "none";
    document.getElementById("section_announcements").style.display = "none";
    document.getElementById("section_members").style.display = "none";
    document.getElementById("section_admin").style.display = "none";
    document.getElementById("createAccount").style.display = "none";

    document.getElementById("loggedoffMenu").style.display = "block";
    //document.getElementById("createAccount").style = "display:none"
  });
}

function openNavAction() {
  if (window.innerWidth / window.innerHeight < 1) {
    document.getElementById("mySidenav").style.width = "100%";
  } else if (window.innerWidth / window.innerHeight < 1.2) {
    document.getElementById("mySidenav").style.width = "50%";
  } else if (window.innerWidth / window.innerHeight < 1.7) {
    document.getElementById("mySidenav").style.width = "40%";
  } else {
    document.getElementById("mySidenav").style.width = "30%";
  }
}

function openNav() {
  $("#menuFallBackLink").attr("href", "#");
  openNavAction();
  isOpen = true;
  console.log("Opened nav");
}

$(".form").focusout(function () {
  $(this).focus();
  console.log("Form out of focus. Focusing back on form");
});

function removeFocus() {
  document.activeElement.blur();
}
document.body.addEventListener("touchstart", removeFocus);

$(function () {
  $(".blockdiv div").click(function () {
    /*
    if ($(this).attr("hidden")) {
      $(this).find("a").show(200);
      $(this).attr("hidden", false);
    } else {
      $(this).find("a").hide(200);
      $(this).attr("hidden", true);

    }
    */
  });

  $(document).keypress(function (event) {
    if (event.which == 32) {
      if (snakeShown) {
        hideSnake();
      } else {
        snakeShown = true;
        $("<canvas id='c' width='1000' height='1000'></canvas>")
          .appendTo("body")
          .focus();
        console.log(
          "01000101 01100001 01110011 01110100 01100101 01110010 01000101 01100111 01100111 00111010 00100000 01010011 01101000 01101111 01110111 01101001 01101110 01100111 00100000 01010011 01101110 01100001 01101011 01100101"
        );
      }
    }
  });

  $(".top").dblclick(function () {
    binaryToggle();
  });
  $(".blockDiv h1").dblclick(function () {
    $(".content").css("color", getRandomColor);
    $(".content").css("outline-color", getRandomColor);
    $("p").css("color", getRandomColor);
    $("h1").css("color", getRandomColor);
  });

  $(".content").click(function () {
    if (snakeShown) {
      hideSnake();
    }
    if (videoBlurred) {
      $("#HHSLogo").css("transform", "scale(1.1, 1.1)");
      setTimeout(function () {
        $("#HHSLogo").css("transform", "scale(1.0, 1.0)");
      }, 450);
    }
  });
});

function hideSnake() {
  snakeShown = false;
  $("#c").remove();
  console.log(
    "01000101 01100001 01110011 01110100 01100101 01110010 01000101 01100111 01100111 00111010 00100000 01001000 01101001 01100100 00100000 01010011 01101110 01100001 01101011 01100101"
  );
}

function getRandomColor() {
  var letters = "0123456789ABCDEF";
  var color = "#";
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  console.log(
    "01000101 01100001 01110011 01110100 01100101 01110010 01000101 01100111 01100111 00111010 00100000 01000011 01101000 01100001 01101110 01100111 01100101 01100100 00100000 01110100 01101111 00100000 01110010 01100001 01101110 01100100 01101111 01101101 00100000 01100011 01101111 01101100 01101111 01110010 01110011"
  );
  return color;
}

function binaryToggle() {
  if (isBin) {
    recursiveReplace(document.body);
    isBin = false;
    console.log(
      "01000101 01100001 01110011 01110100 01100101 01110010 01000101 01100111 01100111 00111010 00100000 01000010 01100001 01100011 01101011 00100000 01110100 01101111 00100000 01110100 01100101 01111000 01110100"
    );
  } else {
    recursiveReplace(document.body);
    isBin = true;
    console.log(
      "01000101 01100001 01110011 01110100 01100101 01110010 01000101 01100111 01100111 00111010 00100000 01000010 01100001 01100011 01101011 00100000 01110100 01101111 00100000 01100010 01101001 01101110 01100001 01110010 01111001"
    );
  }
}

/* Set the width of the side navigation to 0 */
function closeNav() {
  document.getElementById("mySidenav").style.width = "0";
  isOpen = false;
  console.log("Closed Nav");
}

window.addEventListener("resize", function (event) {
  if (isOpen === true) {
    openNavAction();
  }
});

function recursiveReplace(node) {
  if (node.className != "sidenav") {
    if (node.nodeType == 3) {
      // text node
      var text = node.nodeValue.trim();
      var convTxt;
      if (text.replace(/\s/g, "") != "") {
        if (isBin) {
          eachByte = text.split(" ");
          convStr = [];
          for (i = 0; i < eachByte.length; i++) {
            convStr.push(String.fromCharCode(parseInt(eachByte[i], 2)));
          }
          convTxt = convStr.join("");
        } else {
          for (x = 0; x < text.length; x++) {
            convTxt += text[x].charCodeAt(0).toString(2) + " ";
          }
        }

        convTxt = convTxt.replace("undefined", "");
        node.nodeValue = node.nodeValue.replace(text, convTxt);
      }
    } else if (node.nodeType == 1) {
      // element
      $(node)
        .contents()
        .each(function () {
          recursiveReplace(this);
        });
    }
  }
}

(function () {
  var SIZE =
    window.innerWidth < window.innerHeight ?
    window.innerWidth :
    window.innerHeight; // Size of the play-field in pixels
  var GRID_SIZE = SIZE / 50;
  var c;
  var context;

  var direction = (newDirection = 1); // -2: up, 2: down, -1: left, 1: right
  var snakeLength = 5;
  var snake = [{
    x: SIZE / 2,
    y: SIZE / 2
  }]; // Snake starts in the center
  var candy = null;
  var end = false;

  function randomOffset() {
    return Math.floor((Math.random() * SIZE) / GRID_SIZE) * GRID_SIZE;
  }

  function stringifyCoord(obj) {
    return [obj.x, obj.y].join(",");
  }

  function tick() {
    var newHead = {
      x: snake[0].x,
      y: snake[0].y
    };

    // Only change directon if the new direction is a different axis
    if (Math.abs(direction) !== Math.abs(newDirection)) {
      direction = newDirection;
    }
    var axis = Math.abs(direction) === 1 ? "x" : "y"; // 1, -1 are X; 2, -2 are Y
    if (direction < 0) {
      newHead[axis] -= GRID_SIZE; // Move left or down
    } else {
      newHead[axis] += GRID_SIZE; // Move right or up
    }

    // Did we eat a candy? Detect if our head is in the same cell as the candy
    if (candy && candy.x === newHead.x && candy.y === newHead.y) {
      candy = null;
      snakeLength += 20;
    }

    context.fillStyle = "#002b36";
    context.fillRect(0, 0, SIZE, SIZE); // Reset the play area
    if (end) {
      context.fillStyle = "#eee8d5";
      context.font = "40px serif";
      context.textAlign = "center";
      context.fillText("Refresh to play again", SIZE / 2, SIZE / 2);
    } else {
      snake.unshift(newHead); // Add the new head to the front
      snake = snake.slice(0, snakeLength); // Enforce the snake's max length
    }

    // Detect wall collisions
    if (
      newHead.x < 0 ||
      newHead.x >= SIZE ||
      newHead.y < 0 ||
      newHead.y >= SIZE
    ) {
      end = true;
    }

    context.fillStyle = "#268bd2";
    var snakeObj = {};
    for (var i = 0; i < snake.length; i++) {
      var a = snake[i];
      context.fillRect(a.x, a.y, GRID_SIZE, GRID_SIZE); // Paint the snake
      // Build a collision lookup object
      if (i > 0) snakeObj[stringifyCoord(a)] = true;
    }

    if (snakeObj[stringifyCoord(newHead)]) end = true; // Collided with our tail

    // Place a candy (not on the snake) if needed
    while (!candy || snakeObj[stringifyCoord(candy)]) {
      candy = {
        x: randomOffset(),
        y: randomOffset()
      };
    }

    context.fillStyle = "#b58900";
    context.fillRect(candy.x, candy.y, GRID_SIZE, GRID_SIZE); // Paint the candy
  }

  $("body").on("DOMNodeInserted", "canvas", function () {
    console.log("Hereee");
    c = document.getElementById("c");
    c.height = c.width = SIZE * 2; // 2x our resolution so retina screens look good
    c.style.width = c.style.height = SIZE + "px";
    context = c.getContext("2d");
    context.scale(2, 2); // Scale our canvas for retina screens

    setInterval(tick, 100); // Kick off the game loop!
    window.onkeydown = function (e) {
      newDirection = {
        37: -1,
        38: -2,
        39: 1,
        40: 2
      } [e.keyCode] || newDirection;
    };
  });
})();