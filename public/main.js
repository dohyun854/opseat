// initial box set up

document.addEventListener('DOMContentLoaded', () => {
    let searchParams = new URLSearchParams(window.location.search)

    const rows = searchParams.get('rows');
    const columns = searchParams.get('columns');
    const mainContainer = document.getElementById('main-container');
    mainContainer.style.position = 'relative';

    const containerWidth = mainContainer.clientWidth;
    const containerHeight = mainContainer.clientHeight;
    const boxAspectRatio = 3 / 5;
    const margin = 10;
    const boxScale = 0.8;

    const boxSizeWidth = Math.min(
        (containerWidth - (columns - 1) * margin) / columns,
        (containerHeight - (rows - 1) * margin) / (rows * boxAspectRatio)
    ) * boxScale;
    const boxSizeHeight = boxSizeWidth * boxAspectRatio;

    const totalWidth = columns * boxSizeWidth + (columns - 1) * margin;
    const totalHeight = rows * boxSizeHeight + (rows - 1) * margin;

    const offsetX = (containerWidth - totalWidth) / 2;
    const offsetY = (containerHeight - totalHeight) / 2;

    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < columns; col++) {
            const box = document.createElement('div');
            box.className = 'box';
            box.id = `box-${row}-${col}`;
            box.style.width = `${boxSizeWidth}px`;
            box.style.height = `${boxSizeHeight}px`;
            box.style.left = `${offsetX + col * (boxSizeWidth + margin)}px`;
            box.style.top = `${offsetY + row * (boxSizeHeight + margin)}px`;

            const boxNumber = document.createElement('div');
            boxNumber.className = 'box-number';
            boxNumber.textContent = row * columns + col + 1;
            box.appendChild(boxNumber);

            mainContainer.appendChild(box);
        }
    }

    const boxes = document.querySelectorAll('.box');

    boxes.forEach(box => {
        let offsetX, offsetY;
        box.style.cursor = 'grab';

        box.addEventListener('mousedown', (e) => {
            offsetX = e.clientX - box.getBoundingClientRect().left;
            offsetY = e.clientY - box.getBoundingClientRect().top;
            box.style.cursor = 'grabbing';

            const onMouseMove = (e) => {
                const containerRect = mainContainer.getBoundingClientRect();
                const boxRect = box.getBoundingClientRect();

                let left = e.clientX - containerRect.left - offsetX;
                let top = e.clientY - containerRect.top - offsetY;

                // 상자가 컨테이너를 벗어나지 않도록 조정
                left = Math.max(0, Math.min(containerRect.width - boxRect.width, left));
                top = Math.max(0, Math.min(containerRect.height - boxRect.height, top));

                box.style.left = `${left}px`;
                box.style.top = `${top}px`;
            };

            const onMouseUp = () => {
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);
                box.style.cursor = 'grab';
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    });
});


// removing boxes

document.getElementById('remove-button').addEventListener('click', () => {
    const selectedNumber = parseInt(document.getElementById('remove-dropdown').value);

    // 선택된 번호에 해당하는 상자 제거
    const boxes = document.querySelectorAll('.box');
    boxes.forEach(box => {
        const boxNumberElement = box.querySelector('.box-number');
        if (boxNumberElement && parseInt(boxNumberElement.textContent) === selectedNumber) {
            box.remove();
        }
    });

    // 마지막 드롭다운 행 제거
    const dropRows = document.querySelectorAll('#drop-container .drop-row');
    const lastDropRow = dropRows[dropRows.length - 1];
    if (lastDropRow) {
        lastDropRow.remove();
    }

    // 드롭다운에서 해당 번호 제거
    const removeDropdown = document.getElementById('remove-dropdown');
    const optionToRemove = removeDropdown.querySelector(`option[value="${selectedNumber}"]`);
    if (optionToRemove) {
        optionToRemove.remove();
    }
});


// linear programming -- edit needed

function getDistance(box1, box2) {
    const box1Rect = box1.getBoundingClientRect();
    const box2Rect = box2.getBoundingClientRect();

    // 박스의 중심 좌표를 구함
    const box1CenterX = box1Rect.left + box1Rect.width / 2;
    const box1CenterY = box1Rect.top + box1Rect.height / 2;
    const box2CenterX = box2Rect.left + box2Rect.width / 2;
    const box2CenterY = box2Rect.top + box2Rect.height / 2;

    // 두 박스의 중심 좌표 간의 거리 계산
    const distance = Math.sqrt(
        Math.pow(box2CenterX - box1CenterX, 2) + 
        Math.pow(box2CenterY - box1CenterY, 2)
    );
    
    return distance;
}

const glpk = require('glpk.js');

function solveProblem(n, Selections) {
    // initializing variables
    let lp = {
        name: 'Minimise the sum of weighted distances',
        objective: {
            direction: glpk.GLP_MIN, // minimise
            name: 'distanceSum',
            vars: []
        },
        subjectTo: [],
        bounds: []
    };

    // defining objective function
    for (let i=0; i<n; i++) {
        lp.objective.vars.push({name: 'd_${i}_1', coef: 3});
        lp.objective.vars.push({name: 'd_${i}_2', coef: 2});
        lp.objective.vars.push({name: 'd_${i}_3', coef: 1});

        let d1 = getDistance(boxes[i], Selections[i][0]);
        let d2 = getDistance(boxes[i], Selections[i][1]);
        let d3 = getDistance(boxes[i], Selections[i][2]);

        lp.subjectTo.push({

        })

        lp.bounds.push({
            name: 'x_${i}',
            type: glpk.GLP_DB,
            lb: 0,
            ub: n-1
        })
    }

    for (let i=0; i<n; i++) {
        for (let j=i+1; j<n; j++) {
            lp.subjectTo.push({
                name: 'inequality_${i}_${j}',
                vars: [{name: 'x_${i}', coef: 1}, {name: 'x_${j}', coef: -1}],
                bnds: {type: glpk.GLP_FX, lb:1}
            });
        }
    }

    glpk.solve(lp, function (result) {
        console.log('res:', result.result.z);
        for (let i=0; i<n; i++) {
            console.log('x_${i}:', result.result.vars['x_${i}']);
        }
    });
}



document.getElementById('start').addEventListener('click', function() {
    const boxes = document.querySelectorAll('.box');
    console.log(getDistance(boxes[1], boxes[2]));
})