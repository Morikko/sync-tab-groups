/***
 Navigation
 ...

 Target
 ...

 Bottleneck
 ...

 Global var:
  - Target
  - keyCodes

 Functions:
 TARGET
  - setTarget
  DOM
  - isGroup
  - isTab
  - focusFirstGroup
  - focusLastGroup
  - focusFirstTab
  - focusLastTab
  - focusNextGroup
  - focusPrevGroup
  FACTORY
  - navigationFactory
  - generalNavigationListener
  - groupNavigationListener
  - tabNavigationListener
  - searchBarNavigationListener

**/

var Navigation = Navigation || {};

/** Targetting **/

Navigation.Target = document;

Navigation.setTarget = function (id) {
  Navigation.Target = id;
}

/** DOM change **/
// Avoid hidden :not(.expanded)

Navigation.isElement = function(element, wantedClass) {
  return element.className.split(" ").includes(wantedClass)
}

Navigation.focusParent = function(toElement, element=document.activeElement) {
  while (element.parentElement) {
    element = element.parentElement;
    if (Navigation.isElement(element, toElement)) {
      element.focus()
      return true;
    }
  }
  return false;
}

Navigation.isGroup = function(element=document.activeElement) {
  return Navigation.isElement(element, 'group');
}

Navigation.isTab = function(element=document.activeElement) {
  return Navigation.isElement(element, 'tab');
}

Navigation.focusFirstGroup = function() {
  Navigation.Target.querySelector('.group:not(.hiddenBySearch)').focus();
}

Navigation.focusLastGroup = function() {
  let groups = Navigation.Target.querySelectorAll('.group:not(.hiddenBySearch)');
  groups[groups.length-1].focus();
}

Navigation.focusFirstTab = function(element) {
  if ( Navigation.isTab() ) {
    element.querySelector('.tab:not(.hiddenBySearch)').focus()
  }
}

Navigation.focusLastTab = function(element) {
  if ( Navigation.isTab() ) {
    let tabs = element.querySelectorAll('.tab:not(.hiddenBySearch)');
    tabs[tabs.length-1].focus();
  }
}

Navigation.focusNext = function() {
  let results = Navigation.Target.querySelectorAll('.group:not(.hiddenBySearch), .tab-list:not(.hiddenBySearch) .tab:not(.hiddenBySearch)')

  if ( !results.length ) {
    return;
  }

  let index = [].indexOf.call(results, document.activeElement)

  if ( index > -1 && index < results.length-1) {
    results[index+1].focus();
  } else {
    results[0].focus();
  }
}

Navigation.focusPrevious = function() {
  let results = Navigation.Target.querySelectorAll('.group:not(.hiddenBySearch), .tab-list:not(.hiddenBySearch) .tab:not(.hiddenBySearch)')

  if ( !results.length ) {
    return;
  }

  let index = [].indexOf.call(results, document.activeElement)

  if ( index-1 > -1) {
    results[index-1].focus();
  } else {
    results[results.length-1].focus();
  }
}

/** Listeners Factory **/

Navigation.navigationFactory = function(params) {
  return function(e) {
    let command = Navigation.keyCodes[e.keyCode];
    if ( e.ctrlKey ) {
      command = "ctrl+" + command
    }
    if ( e.shiftKey ) {
      command = "shift+" + command
    }
    if ( params[command] ) {
      params[command](e)
      e.stopPropagation();
    }
  }
}

var generalNavigationListener = Navigation.navigationFactory({
  "up": (e) => {
    e.preventDefault();
    Navigation.focusPrevious()
  },
  "down": (e) => {
    e.preventDefault();
    Navigation.focusNext()
  },
  "insert": (e) => {
    e.preventDefault();
    let input = document.querySelector('.addButton input');
    if ( input ) {
      input.focus();
    } else {
      document.querySelector('.addButton').click();
    }
  },
  "home": (e) => {
    e.preventDefault();
    Navigation.focusFirstGroup()
  },
  "end": (e) => {
    e.preventDefault();
    Navigation.focusLastGroup()
  },
  "pageup": (e) => {
    e.preventDefault();
    Navigation.focusFirstTab(document.activeElement.parentElement)
  },
  "pagedown": (e) => {
    e.preventDefault();
    Navigation.focusLastTab(document.activeElement.parentElement)
  },
  "shift+pageup": (e) => {
    e.preventDefault();
    Navigation.Target.querySelector(".reduce-groups").click();
  },
  "shift+pagedown": (e) => {
    e.preventDefault();
    Navigation.Target.querySelector(".expand-groups").click();
  },
  "ctrl+f": (e) => {
    e.preventDefault();
    Navigation.Target.querySelector('.search-input').focus()
  },
});

var popupSpecialNavigationListener = Navigation.navigationFactory({
  "ctrl+m": (e) => {
    e.preventDefault();
    document.getElementById('open-manager').click()
  },
  "ctrl+p": (e) => {
    e.preventDefault();
    document.getElementById('open-preferences').click()
  },
  "ctrl+o": (e) => {
    e.preventDefault();
    document.getElementById('change-visibility').click()
  },
  "ctrl+l": (e) => {
    e.preventDefault();
    document.getElementById('maximize-popup').click()
  },
})

var groupNavigationListener = function(group) {
  return Navigation.navigationFactory({
      "spacebar": (e)=>{
        if (!group.state.editing) {
          e.preventDefault();
          group.handleGroupExpandClick();
        }
      },
      "enter": ()=>{
        if (group.state.editing) {
          Navigation.focusParent('group', document.activeElement);
          group.handleGroupEditSaveClick();
        } else {
          group.handleGroupClick()
        }
      },
      "shift+enter": group.handleOpenInNewWindowClick,
      "delete": (e)=>{
        if (!group.state.editing) {
          e.preventDefault();
          group.handleGroupCloseClick();
        }
      },
      "shift+delete": group.handleGroupRemoveClick,
      "backspace": (e)=>{
        if (!group.state.editing) {
          e.preventDefault();
          group.handleGroupCloseAbortClick();
        }
      },
      "ctrl+e": group.handleGroupEditClick,
      "shift+backspace": ()=>{
        Navigation.focusParent('group', document.activeElement);
        group.handleGroupEditAbortClick();
      },
      "shift+up": (e)=>{
        e.preventDefault();
        if ( !group.props.groupDraggable ) {
          return;
        }
        group.props.onGroupChangePosition(
          group.props.group.id,
          group.props.group.position-1,
        );
      },
      "shift+down": (e)=>{
        e.preventDefault();
        if ( !group.props.groupDraggable ) {
          return;
        }
        group.props.onGroupChangePosition(
          group.props.group.id,
          group.props.group.position+2,
        );
      },
    })
}

var tabNavigationListener = function(tab) {
  return Navigation.navigationFactory({
      "enter": ()=>tab.onTabClick(false),
      "shift+enter": ()=>tab.onTabClick(true),
      "spacebar": (e)=>{
        e.preventDefault();
        document.activeElement.parentElement.parentElement.focus()
      },
      "delete": tab.handleCloseTabClick,
      "ctrl+enter": tab.handleOpenTabClick,
      "shift+p": tab.handleChangePin,
      "shift+up": (e)=>{
        e.preventDefault();
        tab.props.onGroupDrop(
          tab.props.group.id,
          tab.props.tabIndex,
          tab.props.group.id,
          tab.props.tabIndex-1,
        );
        document.activeElement.previousSibling.focus();
      },
      "shift+down": (e)=>{
        e.preventDefault();
        tab.props.onGroupDrop(
          tab.props.group.id,
          tab.props.tabIndex,
          tab.props.group.id,
          tab.props.tabIndex+2,
        );
        document.activeElement.nextSibling.focus();
      },
    })
}

var searchBarNavigationListener = function(searchbar) {
  return Navigation.navigationFactory({
    "shift+backspace": searchbar.clearSearchBar,
  })
}

var addButtonNavigationListener = function(addbutton) {
  return Navigation.navigationFactory({
    "shift+backspace": ()=>{
      Navigation.focusParent('addButton', document.activeElement);
      addbutton.onEditAbort();
    },
    "enter": ()=>{
      Navigation.focusParent('addButton', document.activeElement);
      addbutton.onTitleSet();
    },
  })
}

/** Utils **/

Navigation.keyCodes = {
  0 : "That key has no keycode",
  3 : "break",
  8 : "backspace",
  9 : "tab",
  12 : 'clear',
  13 : "enter",
  16 : "shift",
  17 : "ctrl",
  18 : "alt",
  19 : "pause/break",
  20 : "caps lock",
  21 : "hangul",
  25 : "hanja",
  27 : "escape",
  28 : "conversion",
  29 : "non-conversion",
  32 : "spacebar",
  33 : "pageup",
  34 : "pagedown",
  35 : "end",
  36 : "home",
  37 : "left",
  38 : "up",
  39 : "right",
  40 : "down",
  41 : "select",
  42 : "print",
  43 : "execute",
  44 : "Print Screen",
  45 : "insert",
  46 : "delete",
  47 : "help",
  48 : "0",
  49 : "1",
  50 : "2",
  51 : "3",
  52 : "4",
  53 : "5",
  54 : "6",
  55 : "7",
  56 : "8",
  57 : "9",
  58 : ":",
  59 : "semicolon (firefox), equals",
  60 : "<",
  61 : "equals (firefox)",
  63 : "ß",
  64 : "@ (firefox)",
  65 : "a",
  66 : "b",
  67 : "c",
  68 : "d",
  69 : "e",
  70 : "f",
  71 : "g",
  72 : "h",
  73 : "i",
  74 : "j",
  75 : "k",
  76 : "l",
  77 : "m",
  78 : "n",
  79 : "o",
  80 : "p",
  81 : "q",
  82 : "r",
  83 : "s",
  84 : "t",
  85 : "u",
  86 : "v",
  87 : "w",
  88 : "x",
  89 : "y",
  90 : "z",
  91 : "Windows Key / Left ⌘ / Chromebook Search key",
  92 : "right window key",
  93 : "Windows Menu / Right ⌘",
  95: "sleep",
  96 : "numpad 0",
  97 : "numpad 1",
  98 : "numpad 2",
  99 : "numpad 3",
  100 : "numpad 4",
  101 : "numpad 5",
  102 : "numpad 6",
  103 : "numpad 7",
  104 : "numpad 8",
  105 : "numpad 9",
  106 : "multiply",
  107 : "add",
  108 : "numpad period (firefox)",
  109 : "subtract",
  110 : "decimal point",
  111 : "divide",
  112 : "f1",
  113 : "f2",
  114 : "f3",
  115 : "f4",
  116 : "f5",
  117 : "f6",
  118 : "f7",
  119 : "f8",
  120 : "f9",
  121 : "f10",
  122 : "f11",
  123 : "f12",
  124 : "f13",
  125 : "f14",
  126 : "f15",
  127 : "f16",
  128 : "f17",
  129 : "f18",
  130 : "f19",
  131 : "f20",
  132 : "f21",
  133 : "f22",
  134 : "f23",
  135 : "f24",
  144 : "num lock",
  145 : "scroll lock",
  160 : "^",
  161 : '!',
  163 : "#",
  164 : '$',
  165 : 'ù',
  166 : "page backward",
  167 : "page forward",
  168 : "refresh",
  169 : "closing paren (AZERTY)",
  170 : '*',
  171 : "~ + * key",
  172 : "home key",
  173 : "minus (firefox), mute/unmute",
  174 : "decrease volume level",
  175 : "increase volume level",
  176 : "next",
  177 : "previous",
  178 : "stop",
  179 : "play/pause",
  180 : "e-mail",
  181 : "mute/unmute (firefox)",
  182 : "decrease volume level (firefox)",
  183 : "increase volume level (firefox)",
  186 : "semi-colon / ñ",
  187 : "equal sign",
  188 : "comma",
  189 : "dash",
  190 : "period",
  191 : "forward slash / ç",
  192 : "grave accent / ñ / æ / ö",
  193 : "?, / or °",
  194 : "numpad period (chrome)",
  219 : "open bracket",
  220 : "back slash",
  221 : "close bracket / å",
  222 : "single quote / ø / ä",
  223 : "`",
  224 : "left or right ⌘ key (firefox)",
  225 : "altgr",
  226 : "< /git >, left back slash",
  230 : "GNOME Compose Key",
  231 : "ç",
  233 : "XF86Forward",
  234 : "XF86Back",
  240 : "alphanumeric",
  242 : "hiragana/katakana",
  243 : "half-width/full-width",
  244 : "kanji",
  255 : "toggle touchpad"
};
