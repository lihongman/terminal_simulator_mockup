/**
 * Fakes the filesystem for terminal.
 */
export class Filesystem {
    constructor() {
        this.filesystem = {};
        this.currentDir = this.filesystem;
        this.path = [];
        this.getPath = getPath;
        this.ls = ls;
        this.cd = cd;
        this.mkdir = mkdir;
        this.rm = rm;
        this.open = openFile;
        this.create = createFile;
        this.save = saveFile;
    }
}

// TODO: Fix issues related to hitting backspace adding spaces after command due to how buffer in xterm.js is implemented.
// TODO: Convert structure of filesystem to include type and data rather as an intermediary rather than
//       the file/folder itself.

function getPath() {
    let output = "~";
    for(const p of this.path) {
        output += "/" + p;
    }
    return output;
}

function ls(loc = null) {
    let output = "";
    if(loc == null) {
        for(const key in this.currentDir) {
            if(typeof this.currentDir[key] == "string") {
                output += key + " \t";
            } else {
                output += key + "/ \t";
            }
        }
        return output;
    }
    if(this.currentDir[loc] == null) {
        return "No such file or directory";
    }
    if(typeof this.currentDir[loc] == "string") {
        return loc;
    }
    for(const key in this.currentDir[loc]) {
        output += key + " ";
    }
    return output;
}

function cd(loc) {
    // Handle going up one directory
    if(loc == "..") {
        if(this.path.length == 0) {
            return false;
        }
        let lastDir = this.path.pop();
        let currDir = this.filesystem;
        for(const p of this.path) {
            currDir = currDir[p];
        }
        currDir[lastDir] = this.currentDir;
        this.currentDir = currDir;
        return true;
    }
    // If going to same directory
    if(loc == ".") {
        return true;
    }
    // If what you want is a file.
    if(this.currentDir[loc] == null || typeof this.currentDir[loc] == "string") {
        return false;
    }
    
    // If selecting a directory
    this.path.push(loc);
    this.currentDir = this.currentDir[loc];
    return true;
}

function mkdir(name) {
    if(this.currentDir[name] == null) {
        this.currentDir[name] = {};
        return "";
    }
    return `Cannot create directory '${name}': File exists`;
}

function rm(name, recursive = false) {
    if(this.currentDir[name] == null) {
        return "No such file or directory";
    }
    if(recursive) {
        delete this.currentDir[name];
        return "";
    }
    if(this.currentDir[name] == "string") {
        delete this.currentDir[name];
        return "";
    }
    return `${name} is a directory`;
}

function openFile(name) {
    if(typeof this.currentDir[name] == "string") {
        return this.currentDir[name];
    }
    return null;
}

function createFile(name) {
    if(this.currentDir[name] == null) {
        this.currentDir[name] = "";
        return "";
    }
    return `Cannot create file '${name}': File exists`;;
}

function saveFile(fileName, data) {
    if(typeof this.currentDir[fileName] == "string") {
        this.currentDir[fileName] = data;
        return true;
    }
    return false;
}