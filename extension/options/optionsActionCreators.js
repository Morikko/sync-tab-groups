const OptionsActionCreators = {
  setOptions: function(options) {
    return {
      type: "OPTIONS::RECEIVE",
      options: options,
    };
  },

  setBackupList: function(backupList) {
    return {
      type: "BACKUPLIST::RECEIVE",
      backupList: backupList,
    };
  },
};

export default OptionsActionCreators