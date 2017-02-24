function basefilename(filename) {
  var extract = filename.split('.').pop(); // the entire string if there is no '.' in filename
  if (extract != filename) {
    return extract;
  }
}

function getFileExtensions(jsontree) {
  var extensions = [];
  (function f(value) {
    if (value.name !== undefined) {
      if (value._type === "file") {
        var ext = basefilename(value.name);
        if (ext !== undefined && extensions.indexOf(ext) < 0) {
          extensions.push(ext);
        }
      }
      if (value.children !== undefined) {
        value.children.forEach(function(v) {
          f(v);
        });
      }
    }
  })(jsontree);
  return extensions;
}

function fileMapByExtension(jsontree) {
  var extensions = [];
  var result = {};
  (function f(value) {
    if (value.name !== undefined) {
      if (value._type === "file") {
        var ext = basefilename(value.name);
        if (ext !== undefined) {
          if (extensions.indexOf(ext) < 0) {
            extensions.push(ext);
            result[ext] = [];
          }
          result[ext].push(value.name);
        }
      }
      if (value.children !== undefined) {
        value.children.forEach(function(v) {
          f(v);
        });
      }
    }
  })(jsontree);
  return result;
}


function getAllNames(jsontree) {
  return (function extract_select2_data(node, leaves, index) {
    if (node.children) {
      for (var i = 0; i < node.children.length; i++) {
        index = extract_select2_data(node.children[i], leaves, index)[0];
      }
    } else {
      leaves.push({
        id: ++index,
        text: node.name
      });
    }
    return [index, leaves];
  })(jsontree, [], 0)[1];
}

function getPaths(jsontree, name) {
  return (function searchTree(obj, search, path) {
    if (obj.name === search) { //if search is found return, add the object to the path and return it
      path.push(obj);
      return path;
    } else if (obj.children || obj._children) { //if children are collapsed d3 object will have them instantiated as _children
      var children = (obj.children) ? obj.children : obj._children;
      for (var i = 0; i < children.length; i++) {
        path.push(obj); // we assume this path is the right one
        var found = searchTree(children[i], search, path);
        if (found) { // we were right, this should return the bubbled-up path from the first if statement
          return found;
        } else { //we were wrong, remove this parent from the path and continue iterating
          path.pop();
        }
      }
    } else { //not the right object, return false so it will continue to iterate in the loop
      return false;
    }
  })(jsontree, name, []);
}

// recommence toute cette fonction !!
// tu peux louper search sur touts les fichiers qui match
// de json tree tu peux faire : {R: ["a.R", "b.R"], pdf: ....}
function filterTree(obj, search, path) {
  if (basefilename(obj.name) === search) { //if search is found return, add the object to the path and return it
    path.push(obj);
    //return path;
  }
  if (obj.children || obj._children) { //if children are collapsed d3 object will have them instantiated as _children
    var children = (obj.children) ? obj.children : obj._children;
    for (var i = 0; i < children.length; i++) {
      // path.push(obj); // we assume this path is the right one
      if (basefilename(children[i].name) === search) {
        //path.push(children[i]);
        filterTree(children[i], search, path); // NON tu push pas ou tu push deux fois...
      }
    }
  } else { //not the right object, return false so it will continue to iterate in the loop
    return path;
  }
}
