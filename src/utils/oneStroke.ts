module utils.oneStroke {

    export interface Point {
        row: number;
        col: number;
    }

    function isIn(p: Point, pArr: Point[]) {
        for (let index = 0; index < pArr.length; index++) {
            if (pArr[index].row === p.row && pArr[index].col === p.col) {
                return true;
            }
        }
        return false;
    }

    function getContiguousPoint(p: Point, mapDataArr: Array<Array<number>>, path: Point[]): Array<Point> {
        const rows = mapDataArr.length;
        const cols = mapDataArr[0].length;
        const pointArr: Array<Point> = new Array<Point>();
        let tmpP: Point = null;
        if (p.row > 0) {
            tmpP = { row: p.row - 1, col: p.col };
            if (mapDataArr[tmpP.row][tmpP.col] > 0 && !isIn(tmpP, path)) {
                pointArr.push(tmpP);
            }
        }
        if (p.col + 1 < cols) {
            tmpP = { row: p.row, col: p.col + 1 };
            if (mapDataArr[tmpP.row][tmpP.col] > 0 && !isIn(tmpP, path)) {
                pointArr.push(tmpP);
            }
        }
        if (p.row + 1 < rows) {
            tmpP = { row: p.row + 1, col: p.col };
            if (mapDataArr[tmpP.row][tmpP.col] > 0 && !isIn(tmpP, path)) {
                pointArr.push(tmpP);
            }
        }
        if (p.col > 0) {
            tmpP = { row: p.row, col: p.col - 1 };
            if (mapDataArr[tmpP.row][tmpP.col] > 0 && !isIn(tmpP, path)) {
                pointArr.push(tmpP);
            }
        }
        return pointArr;
    }

    function isSuccess(path: Point[], mapDataArr: Array<Array<number>>): boolean {
        const rows = mapDataArr.length;
        const cols = mapDataArr[0].length;
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                if (mapDataArr[row][col] > 0) {
                    if (!isIn({ row, col }, path)) return false;
                }
            }
        }
        return true;
    }

    function findNextPoint(path: Point[], mapDataArr: Array<Array<number>>): boolean {
        // 相邻的点
        const contiguousPointArr = getContiguousPoint(path[path.length - 1], mapDataArr, path);
        if (contiguousPointArr.length === 0) {
            // 看看成功了没
            return isSuccess(path, mapDataArr)
        } else {
            let tmpP: Point = null;
            for (let index = 0; index < contiguousPointArr.length; index++) {
                tmpP = contiguousPointArr[index];
                path.push(tmpP);
                if (findNextPoint(path, mapDataArr)) {
                    return true;
                } else {
                    for (let i = 0; i < path.length; i++) {
                        if (path[i].row === tmpP.row && path[i].col === tmpP.col) {
                            path.splice(i, path.length - i);
                            break;
                        }
                    }
                }
            }
        }
        return false;
    }

    export function getPath(mapDataArr: Array<Array<number>>): Array<Point> {
        // find the start point
        let firstPoint: Point = null;
        const path = new Array<Point>();
        for (let row = 0; row < mapDataArr.length; row++) {
            for (let col = 0; col < mapDataArr[row].length; col++) {
                if (mapDataArr[row][col] === 2) {
                    firstPoint = { row, col };
                    break;
                }
            }
            if (firstPoint) {
                break;
            }
        }
        if (!firstPoint) {
            return path;
        }
        path[0] = firstPoint;
        findNextPoint(path, mapDataArr);
        return path;
    }
}