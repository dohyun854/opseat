let boxList = [];
let rows, columns;

// initial box set up

document.addEventListener('DOMContentLoaded', () => {
    let searchParams = new URLSearchParams(window.location.search)

    rows = searchParams.get('rows');
    columns = searchParams.get('columns');
    boxList = Array.from({ length: rows*columns }, (_, i) => i + 1);

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
            box.className = 'box shadow';
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
    // const selectedNumber = parseInt(document.getElementById('remove-dropdown').value);

    // // remove from the list
    // boxList.splice(selectedNumber-1, 1);

    // // remove the box
    // const boxes = document.querySelectorAll('.box');
    // boxes.forEach(box => {
    //     const boxNumberElement = box.querySelector('.box-number');
    //     if (boxNumberElement && parseInt(boxNumberElement.textContent) === selectedNumber) {
    //         box.remove();
    //     }
    // });

    // // remove last dropdown selection row
    // const dropRows = document.querySelectorAll('#drop-container .drop-row');
    // const lastDropRow = dropRows[dropRows.length - 1];
    // if (lastDropRow) {
    //     lastDropRow.remove();
    // }
    
    // // remove from the remove selection
    // const removeDropdown = document.getElementById('remove-dropdown');
    // const optionToRemove = removeDropdown.querySelector(`option[value="${selectedNumber}"]`);
    // if (optionToRemove) {
    //     optionToRemove.remove();
    // }

    // // remove from the selection dropdown
    // const dropdowns = document.querySelectorAll('.drop-container select'); // 모든 드롭다운 선택
    // dropdowns.forEach(dropdown => {
    //     const options = dropdown.options; // 현재 드롭다운의 모든 옵션 가져오기
    //     for (let i = options.length - 1; i >= 0; i--) { // 뒤에서부터 순회
    //         if (parseInt(options[i].value) === selectedNumber) {
    //             dropdown.remove(i); // 해당 옵션 제거
    //         }
    //     }
    // });
    
    // show toast
    const toastEl = document.getElementById('remove-toast');
    if (toastEl) { // toastEl가 존재하는지 확인
        const toast = new bootstrap.Toast(toastEl);
        toast.show(); // 토스트 표시
    } else {
        console.error("토스트 요소를 찾을 수 없습니다.");
    }
});


// linear programming -- edit needed

function getDistance(box1, box2) {
    const box1Rect = box1.getBoundingClientRect();
    const box2Rect = box2.getBoundingClientRect();

    const box1CenterX = box1Rect.left + box1Rect.width / 2;
    const box1CenterY = box1Rect.top + box1Rect.height / 2;
    const box2CenterX = box2Rect.left + box2Rect.width / 2;
    const box2CenterY = box2Rect.top + box2Rect.height / 2;

    const distance = Math.sqrt(
        Math.pow(box2CenterX - box1CenterX, 2) + 
        Math.pow(box2CenterY - box1CenterY, 2)
    );
    
    return distance;
}

function getDropdownValues() {
    const dropdowns = document.querySelectorAll('#drop-container select');
    const values = [];
    const group = [];

    dropdowns.forEach(dropdown => {
        values.push(dropdown.value);
    });

    for (let i = 0; i < values.length; i++) {
        if (values[i] == '랜덤') {
            const randomIndex = Math.floor(Math.random() * boxList.length);
            const randomElement = boxList[randomIndex];
            values[i] = String(randomElement);
        }
        values[i] = parseInt(values[i], 10);
    }

    const groupedValues = [];
    for (let i = 0; i < values.length; i += 3) {
        groupedValues.push(values.slice(i, i + 3));
    }

    return groupedValues;
}

function simulatedAnnealing(n, seats, selections, maxIter=10000, initialTemp=100, coolingRate=0.99) {
    let x = Array.from({length: n}, (_, i) => i);

    function objective(x) {
        let sum=0;
        for (let i=0; i<n; i++) {
            sum += 3*getDistance(seats[x[i]], seats[selections[i][0]-1]) + 2*getDistance(seats[x[i]], seats[selections[i][1]-1]) + getDistance(seats[x[i]], seats[selections[i][2]-1]);
        }
        return sum;
    }

    function getNeighbor(x) {
        let newX = [...x];
        let i = Math.floor(Math.random()*n);
        let j = Math.floor(Math.random()*n);
        [newX[i], newX[j]] = [newX[j], newX[i]];
        return newX;
    }

    let currentX = x;
    let currentVal = objective(currentX);
    let bestX = [...currentX];
    let bestVal = currentVal;

    let T = initialTemp

    for (let iter = 0; iter<maxIter; iter++) {
        let newX = getNeighbor(currentX);
        let newVal = objective(newX);

        if (newVal < currentVal || Math.random < Math.exp((currentVal - newVal)/T)) {
            currentX = newX;
            currentVal = newVal;
            if (currentVal < bestVal) {
                bestX = [...currentX];
                bestVal = currentVal;
                console.log(bestVal);
            }
        }
        T*=coolingRate;
        if (T<1e-8) break;
    }
    return {bestX, bestVal};
}

// FUCKED ONE
function solveProblem(n, Selections) {
    // initializing variables
    let lp = {
        name: 'Minimise the sum of weighted distances',
        objective: {
            direction: glpk.GLP_MIN,
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

        let d1 = getDistance(boxes[i], boxes[Selections[i][0]]);
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

    const dropdownValues = getDropdownValues();
    console.log(dropdownValues);
    
    const { bestX, bestVal } = simulatedAnnealing(boxes.length, boxes, dropdownValues);
    console.log(bestX);
    
    bestX.forEach((value, index) => {
        const box = document.getElementById(`box-${Math.floor((value) / columns)}-${(value) % columns}`);
        const boxNumberElement = box.querySelector('.box-number');
        boxNumberElement.textContent = index + 1;
    });
});


