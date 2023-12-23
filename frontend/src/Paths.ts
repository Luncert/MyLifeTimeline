
export class Path {

  constructor(private readonly paths: string[]) {
  }

  contains(p: Path) {
    if (this.paths.length <= p.paths.length) {
      return false;
    }
    for (let i = 0; i < p.paths.length; i++) {
      if (p.paths[i] !== this.paths[i]) {
        return false;
      }
    }
    return true;
  }

  isChildOf(p: Path) {
    if (this.paths.length !== p.paths.length + 1) {
      return false;
    }
    for (let i = 0; i < p.paths.length; i++) {
      if (p.paths[i] !== this.paths[i]) {
        return false;
      }
    }
    return true;
  }

  equalsTo(p: Path) {
    if (this.paths.length != p.paths.length) {
      return false;
    }

    for (let i = 0; i < p.paths.length; i++) {
      if (p.paths[i] !== this.paths[i]) {
        return false;
      }
    }
    return true;
  }

  resolve(path: string) {
    const p = [...this.paths, ...resolvePathToArray(path)];
    return new Path(p);
  }

  getPattern(idx: number) {
    return this.paths[idx];
  }

  patterns() {
    return [...this.paths];
  }

  subPatterns(end: number): string[] {
    const r = [];
    end = Math.min(end, this.paths.length);
    for (let i = 0; i < end; i++) {
      r.push(this.paths[i]);
    }
    return r;
  }

  length() {
    return this.paths.length;
  }

  toString() {
    return this.paths.join("/");
  }
}

export function resolvePath(path: string) {
  return new Path(resolvePathToArray(path));
}

function resolvePathToArray(path: string) {
  let paths = [];
  let pattern = "";
  for (let c of path) {
    if (c == '/' || c == '\\') {
      if (pattern.length > 0) {
        paths.push(pattern.trim());
        pattern = "";
      }
    } else {
      pattern += c;
    }
  }
  if (pattern.length > 0) {
    paths.push(pattern.trim());
    pattern = "";
  }
  return paths;
}

export function of(paths: string[]) {
  return new Path(paths);
}

export function contains(p1: string, p2: string) {
  return resolvePath(p1).contains(resolvePath(p2));
}

export function isChildOf(p1: string, p2: string) {
  return resolvePath(p1).isChildOf(resolvePath(p2));
}

export default ({
  of,
  contains,
  resolvePath,
  isChildOf
})