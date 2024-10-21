

# OpSeat - 최적화된 자리 배치
## https://opseat.kro.kr
Optimized Seat Planning System <br>
Simulated Annealing 최적화 기반 <br>
모두가 만족할 최적의 자리 배치 <br>
Developed by Dohyun Kim
## 특징
- OpSeat은 임의로 자리를 배치하는 타 프로그램들과 달리 [Simulated Annealing](https://en.wikipedia.org/wiki/Simulated_annealing) (SA, 담금질 기법) 최적화 알고리즘을 사용합니다. 학생들이 1, 2, 3지망의 자리를 선택하면 SA를 기반으로 모두가 만족할 수 있는 자리를 배정해줍니다.
- n×m 형식의 고정된 자리가 아니라, 자리를 드래그해서 위치를 자유롭게 조절할 수 있습니다.
## 스크린샷

![App Screenshot](https://i.ibb.co/zb9g8n8/2024-10-13-145208.png)
![App Screenshot](https://i.ibb.co/fMMnBx4/2024-10-13-145234.png)
![App Screenshot](https://i.ibb.co/6Y345mX/2024-10-13-145549.png)


## 작동 원리 (Simulated Annealing)
### 1. 최적화 문제 정의
#### 변수, 함수 정의
- $d(x, y)$: 자리 $x$와 자리 $y$ 사이의 거리
- $x_{i}$: $i$번 학생의 자리 (결정 변수, Decision Variable)
- $x_{ij}$: $i$번 학생의 $j$지망 자리
- $S$: 자리의 전체 집합
#### 목적 함수 (Objective Function)
$$
\underset{x_{i}\in S }{\min}\sum_{i}^{} 3d(x_{i},x_{i1})+2d(x_{i},x_{i2})+d(x_{i},x_{i3})
$$
#### 제약 조건 (Constraint)
- $\forall i,j(i\not=j ), x_{i}\not=x_{j}$: 모든 $i$와 $j$ ($i\not=j$)에 대해서 $x_{i}\not=x_{j}$
- $x_{i}\in S$

### 2. Simulated Annealing (담금질 기법)
먼저, Simulated Annealing은 목적 함수의 전역 최적해(함수의 최대, 최소)를 찾는 최적화 기법이다. Simulated Annealing에서는 '최대 온도(시작 온도)'와 '최소 온도'라는 것을 설정하여 실행시킨다. 온도는 시간이 지남에 따라 점점 감소하고, 온도가 낮아질 수록 '해 탐색 정도'가 줄어드는 방식으로 최적해(에너지의 최대 또는 최소)를 찾아낸다 (말로 표현하기 어려우므로 의사코드와 참고 영상을 참고하기 바란다).
#### 의사 코드 (Pseudocode)
```
algorithm SimulatedAnnealingOptimizer(T_max, T_min, E_th, α):
    // INPUT
    //    T_max = the maximum temperature
    //    T_min = the minimum temperature for stopping the algorithm
    //    E_th = the energy threshold to stop the algorithm
    //    alpha = the cooling factor
    // OUTPUT
    //    The best found solution

    T <- T_max
    x <- generate the initial candidate solution
    E <- E(x)  // compute the energy of the initial solution

    while T > T_min and E > E_th:
        x_new <- generate a new candidate solution
        E_new <- compute the energy of the new candidate x_new
        ΔE <- E_new - E

        if Accept(ΔE, T):
            x <- x_new
            E <- E_new

        T <- T / alpha  // cool the temperature

    return x
```
의사 코드 출처: https://www.baeldung.com/cs/simulated-annealing
#### 참고
[이 영상](https://youtu.be/eBmU1ONJ-os)에서 Simulated Annealing에 대해 잘 설명하고 있다.

### 3. 적용
(코드 해석은 작성할 예정이다)
```
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
```
    

## 로드맵

- 자리 제거 기능 (진행 중)
- 교탁/칠판 추가
- 다크 모드 지원
- 지망 개수 변경 기능
- 다양한 최적화 알고리즘 추가 적용

## 라이선스
[MIT](https://choosealicense.com/licenses/mit/)

