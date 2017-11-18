/*
I might have modified some parts of the code.
Copyright (c) 2017 Eric Masseran

From: https://github.com/denschub/firefox-tabgroups
Copyright (c) 2015 Dennis Schubert

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
*/
const INITIAL_STATE = Immutable.Map({
  tabgroups: [],
  delayedTasks: {},
  currentWindowId: browser.windows.WINDOW_ID_NONE
});

const Reducer = function(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "TABGROUPS_RECEIVE":
      return state.set("tabgroups", action.tabgroups);
    case "CURRENT_WINDOWS_ID_RECEIVE":
      return state.set("currentWindowId", action.currentWindowId);
    case "DELAYED_TASKS_RECEIVE":
      return state.set("delayedTasks", action.delayedTasks);
  }
  return state;
};
