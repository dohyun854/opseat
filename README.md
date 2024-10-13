# OpSeat - 최적화된 자리 배치
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
아직 작성 중...
#### 목적 함수 (Objective Function)
$$
\underset{x_{i}\in S }{\min}\sum_{i}^{} 3f(x_{i},x_{i1})+2f(x_{i},x_{i2})+f(x_{i},x_{i3}) \newline
\text{subject to} \newline
\forall i,j(i\not=j ): x_{i}\not=x_{j} \newline
\text{Here }S\text{ is a set of seats, } x_{i1}, x_{i2}, x_{i3} \text{ are selections}, f(x,y) \text{ returns the distance between x, y}
$$

## 로드맵

- 자리 제거 기능 (진행 중)
- 교탁/칠판 추가
- 다크 모드 지원
- 지망 개수 변경 기능
- 다양한 최적화 알고리즘 추가 적용
## 라이선스

[MIT](https://choosealicense.com/licenses/mit/)

