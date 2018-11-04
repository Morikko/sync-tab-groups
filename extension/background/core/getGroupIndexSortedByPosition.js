/**
 * Return the index of the groups sorted by the display position
 * @param {Array<Group>} groups
 * @returns {Array<number>} sortedIndex
 */
function getGroupIndexSortedByPosition(groups) {
  let sortedIndex = [];
  for (let pos = 0; pos < groups.length; pos++) {
    for (let i = 0; i < groups.length; i++) {
      if (groups[i].position === pos) {
        sortedIndex.push(groups[i].index);
      }
    }
  }
  // Add them in the order of the array at the end
  if (sortedIndex.length < groups.length) { // Wrong position
    for (let i = 0; i < groups.length; i++) {
      if (sortedIndex.indexOf(i) === -1) {
        sortedIndex.push(i);
      }
    }
  }
  return sortedIndex;
}

export default getGroupIndexSortedByPosition