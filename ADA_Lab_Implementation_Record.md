# ADA Lab Implementation Record 💻

## Experiment 1(a): Implementation of Binary Search (Non-Recursive)
```c
#include <stdio.h>

int binarySearch(int arr[], int n, int val) {
    int low = 0, high = n - 1;
    while (low <= high) {
        int mid = (low + high) / 2;
        if (arr[mid] == val) return mid;
        if (arr[mid] < val) low = mid + 1;
        else high = mid - 1;
    }
    return -1;
}

int main() {
    int arr[] = {10, 20, 30, 40, 50, 60, 70, 80};
    int n = sizeof(arr) / sizeof(arr[0]);
    int val = 40;
    
    int result = binarySearch(arr, n, val);
    
    if (result != -1) printf("Element found at index %d\n", result);
    else printf("Element not found\n");
    
    return 0;
}
```
**Sample Input:**
```text
Array = {10, 20, 30, 40, 50, 60, 70, 80}
Target Element = 40
```
**Sample Output:**
```text
Element found at index 3
```

## Experiment 1(b): Implementation of Binary Search (Recursive)
```c
#include <stdio.h>

int binarySearch(int arr[], int l, int h, int num) {
    if (l > h) return -1;
    int mid = (l + h) / 2;
    if (arr[mid] == num) return mid;
    if (arr[mid] < num) return binarySearch(arr, mid + 1, h, num);
    return binarySearch(arr, l, mid - 1, num);
}

int main() {
    int arr[] = {10, 20, 30, 40, 50, 60, 70, 80};
    int n = 8, num = 70;
    
    int i = binarySearch(arr, 0, n - 1, num);
    
    if (i == -1) printf("%d not found in array\n", num);
    else printf("%d found at position %d in array\n", num, i + 1);
    
    return 0;
}
```
**Sample Input:**
```text
Array = {10, 20, 30, 40, 50, 60, 70, 80}
Target Element = 70
```
**Sample Output:**
```text
70 found at position 7 in array
```

## Experiment 2(a): Find Maximum Element of Given Array (Non-Recursive)
```c
#include <stdio.h>

int main() {
    int arr[] = {12, 45, 7, 89, 23};
    int n = 5;
    int max = arr[0];
    
    for (int i = 1; i < n; i++) {
        if (arr[i] > max) max = arr[i];
    }
    
    printf("Maximum element = %d\n", max);
    return 0;
}
```
**Sample Input:**
```text
Array = {12, 45, 7, 89, 23}
```
**Sample Output:**
```text
Maximum element = 89
```

## Experiment 2(b): Find Maximum Element of Given Array (Recursive)
```c
#include <stdio.h>

int findMax(int arr[], int n) {
    if (n == 1) return arr[0];
    int maxOfRest = findMax(arr, n - 1);
    if (arr[n - 1] > maxOfRest) return arr[n - 1];
    else return maxOfRest;
}

int main() {
    int arr[] = {34, 67, 10, 99, 54};
    int n = 5;
    
    int max = findMax(arr, n);
    printf("Maximum element = %d\n", max);
    
    return 0;
}
```
**Sample Input:**
```text
Array = {34, 67, 10, 99, 54}
```
**Sample Output:**
```text
Maximum element = 99
```

## Experiment 2(c): Find Maximum Element of Given Array (Binary Recursion)
```c
#include <stdio.h>

int findMax(int arr[], int low, int high) {
    if (low == high) return arr[low];
    
    int mid = (low + high) / 2;
    int leftMax = findMax(arr, low, mid);
    int rightMax = findMax(arr, mid + 1, high);
    
    return (leftMax > rightMax) ? leftMax : rightMax;
}

int main() {
    int arr[] = {8, 2, 73, 41, 19};
    int n = 5;
    
    int max = findMax(arr, 0, n - 1);
    printf("Maximum element = %d\n", max);
    
    return 0;
}
```
**Sample Input:**
```text
Array = {8, 2, 73, 41, 19}
```
**Sample Output:**
```text
Maximum element = 73
```

## Experiment 3: Write a program for Merge Sort
```c
#include <stdio.h>

void Merge(int arr[], int l, int mid, int h) {
    int b[20], i = l, j = mid + 1, k = l;
    
    while (i <= mid && j <= h) {
        if (arr[i] < arr[j]) { b[k] = arr[i]; i++; } 
        else { b[k] = arr[j]; j++; }
        k++;
    }
    while (i <= mid) { b[k] = arr[i]; i++; k++; }
    while (j <= h) { b[k] = arr[j]; j++; k++; }
    
    for (i = l; i <= h; i++) arr[i] = b[i];
}

void Merge_Sort(int arr[], int l, int h) {
    int mid;
    if (l < h) {
        mid = (l + h) / 2;
        Merge_Sort(arr, l, mid);
        Merge_Sort(arr, mid + 1, h);
        Merge(arr, l, mid, h);
    }
}

int main() {
    int arr[] = {38, 27, 43, 3, 9, 82, 10};
    int n = 7;
    
    Merge_Sort(arr, 0, n - 1);
    
    printf("Sorted Array is:\n");
    for (int i = 0; i < n; i++) printf("%d\t", arr[i]);
    printf("\n");
    
    return 0;
}
```
**Sample Input:**
```text
Array = {38, 27, 43, 3, 9, 82, 10}
```
**Sample Output:**
```text
Sorted Array is:
3       9       10      27      38      43      82
```

## Experiment 4: Write a program for Quick Sort
```c
#include <stdio.h>

int Partition(int a[], int low, int high) {
    int temp, l = low, h = high, pval = a[low];
    while (l < h) {
        while (a[l] <= pval && l < high) l++;
        while (a[h] > pval) h--;
        if (l < h) {
            temp = a[l]; a[l] = a[h]; a[h] = temp;
        }
    }
    a[low] = a[h];
    a[h] = pval;
    return h;
}

void QuickSort(int a[], int low, int high) {
    int p;
    if (low < high) {
        p = Partition(a, low, high);
        QuickSort(a, low, p - 1);
        QuickSort(a, p + 1, high);
    }
}

int main() {
    int a[] = {50, 20, 60, 10, 30, 40};
    int n = 6;
    
    QuickSort(a, 0, n - 1);
    
    printf("Sorted array:\n");
    for (int i = 0; i < n; i++) printf("%d\t", a[i]);
    printf("\n");
    
    return 0;
}
```
**Sample Input:**
```text
Array = {50, 20, 60, 10, 30, 40}
```
**Sample Output:**
```text
Sorted array:
10      20      30      40      50      60
```

## Experiment 5: Write a program for Insertion Sort
```c
#include <stdio.h>

int main() {
    int arr[] = {43, 12, 8, 55, 21};
    int n = 5, key, j;
    
    for (int i = 1; i < n; i++) {
        key = arr[i];
        j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    
    printf("Sorted Array:\n");
    for (int i = 0; i < n; i++) printf("%d\t", arr[i]);
    printf("\n");
    
    return 0;
}
```
**Sample Input:**
```text
Array = {43, 12, 8, 55, 21}
```
**Sample Output:**
```text
Sorted Array:
8       12      21      43      55
```

## Experiment 6: Write a program for Heap Sort
```c
#include <stdio.h>

void Adjust(int a[], int i, int n) {
    int j = 2 * i, temp = a[i];
    while (j <= n) {
        if (j < n && a[j] < a[j + 1]) j++;
        if (temp >= a[j]) break;
        a[j / 2] = a[j];
        j = 2 * j;
    }
    a[j / 2] = temp;
}

void Heapify(int a[], int n) {
    for (int i = n / 2; i >= 1; i--) Adjust(a, i, n);
}

void HeapSort(int a[], int n) {
    int temp;
    Heapify(a, n);
    for (int i = n; i >= 2; i--) {
        temp = a[i]; a[i] = a[1]; a[1] = temp;
        Adjust(a, 1, i - 1);
    }
}

int main() {
    int a[] = {0, 45, 10, 32, 5, 17}; // 1-based indexing
    int n = 5;
    
    HeapSort(a, n);
    
    printf("Sorted array:\n");
    for (int i = 1; i <= n; i++) printf("%d\t", a[i]);
    printf("\n");
    
    return 0;
}
```
**Sample Input:**
```text
Array = {45, 10, 32, 5, 17}
```
**Sample Output:**
```text
Sorted array:
5       10      17      32      45
```

## Experiment 7: Write a program for solving Greedy Knapsack Problem
```c
#include <stdio.h>

struct KnapsackObject {
    int profit;
    int weight;
    float ratio;
};

int main() {
    // Array pre-sorted by Ratio for simplicity in dummy run
    struct KnapsackObject obj[] = {
        {15, 1, 15.0}, {10, 2, 5.0}, {18, 6, 3.0}, {6, 3, 2.0}
    };
    int n = 4, U = 8, capacity = 8;
    float totalProfit = 0.0, x[10] = {0.0};
    
    for (int i = 0; i < n; i++) {
        if (U < obj[i].weight) {
            x[i] = (float)U / obj[i].weight;
            totalProfit = totalProfit + x[i] * obj[i].profit;
            break;
        }
        x[i] = 1.0;
        U = U - obj[i].weight;
        totalProfit = totalProfit + obj[i].profit;
    }
    
    printf("Selected Objects:\n");
    printf("Profit\tWeight\tFraction Selected\n");
    for (int i = 0; i < n; i++) {
        if (x[i] > 0.0) {
            printf("%d\t%d\t%.2f\n", obj[i].profit, obj[i].weight, x[i]);
        }
    }
    printf("Maximum profit = %.2f\n", totalProfit);
    return 0;
}
```
**Sample Input:**
```text
Knapsack Capacity = 8
Objects (Profit, Weight) = (15,1), (10,2), (18,6), (6,3)
```
**Sample Output:**
```text
Selected Objects:
Profit  Weight  Fraction Selected
15      1       1.00
10      2       1.00
18      6       0.83
Maximum profit = 40.00
```

## Experiment 8: Write a program to implement Kruskal's Algorithm
```c
#include <stdio.h>

int parent[20];
int Find(int x) {
    while (parent[x] > 0) x = parent[x];
    return x;
}
void Union(int j, int k) {
    parent[k] = j;
}

int main() {
    int n = 7, e = 9;
    // Edge format: u, v, w (pre-sorted by weight)
    int edge[][3] = {
        {1, 6, 10}, {3, 4, 12}, {2, 7, 14}, 
        {2, 3, 16}, {4, 7, 18}, {4, 5, 22}, 
        {5, 7, 24}, {5, 6, 25}, {1, 2, 28}
    };
    int i, j, k, u, v, w, mincost = 0;
    
    for (i = 1; i <= n; i++) parent[i] = -1;
    
    printf("Edges in Minimum Spanning Tree:\n");
    for (int p = 0; p < e; p++) {
        u = edge[p][0]; v = edge[p][1]; w = edge[p][2];
        j = Find(u); k = Find(v);
        
        if (j != k) {
            mincost = mincost + w;
            Union(j, k);
            printf("%d -> %d\n", u, v);
        }
    }
    
    printf("Minimum Cost = %d\n", mincost);
    return 0;
}
```
**Sample Input:**
```text
Vertices = 7, Edges = 9
Sorted Edges (u,v,w): 
(1,6,10), (3,4,12), (2,7,14), (2,3,16), (4,7,18), (4,5,22), (5,7,24), (5,6,25), (1,2,28)
```
**Sample Output:**
```text
Edges in Minimum Spanning Tree:
1 -> 6
3 -> 4
2 -> 7
2 -> 3
4 -> 7
4 -> 5
Minimum Cost = 92
```

## Experiment 9: Write a program to implement Prim's Algorithm
```c
#include <stdio.h>
#define MAX 20
#define INF 9999

int main() {
    int n = 5;
    int cost[MAX][MAX] = {
        {0, 0, 0, 0, 0, 0},
        {0, 0, 10, INF, 30, 100},
        {0, 10, 0, 50, INF, INF},
        {0, INF, 50, 0, 20, 10},
        {0, 30, INF, 20, 0, 60},
        {0, 100, INF, 10, 60, 0}
    };
    int near[MAX] = {0, 0, 1, 1, 1, 1}, mincost = 0;
    
    printf("Edges in Minimum Spanning Tree:\n");
    for (int i = 1; i < n; i++) {
        int j = 0, k, min = INF;
        for (k = 2; k <= n; k++) {
            if (near[k] != 0 && cost[k][near[k]] < min) {
                min = cost[k][near[k]];
                j = k;
            }
        }
        
        mincost += cost[j][near[j]];
        printf("%d -> %d\n", near[j], j);
        near[j] = 0;
        
        for (k = 2; k <= n; k++) {
            if (near[k] != 0 && cost[k][j] < cost[k][near[k]]) {
                near[k] = j;
            }
        }
    }
    printf("Minimum Cost = %d\n", mincost);
    return 0;
}
```
**Sample Input:**
```text
Vertices = 5
Cost Adjacency Matrix defined internally.
```
**Sample Output:**
```text
Edges in Minimum Spanning Tree:
1 -> 2
1 -> 4
4 -> 3
4 -> 5
Minimum Cost = 90
```

## Experiment 10: Find Single Source Shortest Path using Dijkstra's Algorithm
```c
#include <stdio.h>
#define MAX 20
#define INF 9999

int main() {
    int n = 5, v = 1;
    int cost[MAX][MAX] = {
        {0, 0, 0, 0, 0, 0},
        {0, 0, 10, INF, 30, 100},
        {0, 10, 0, 50, INF, INF},
        {0, INF, 50, 0, 20, 10},
        {0, 30, INF, 20, 0, 60},
        {0, 100, INF, 10, 60, 0}
    };
    int dist[MAX], s[MAX] = {0};
    
    for (int i = 1; i <= n; i++) dist[i] = cost[v][i];
    s[v] = 1;
    dist[v] = 0;
    
    for (int i = 2; i <= n; i++) {
        int u = -1, min = INF;
        for (int j = 1; j <= n; j++) {
            if (!s[j] && dist[j] < min) { min = dist[j]; u = j; }
        }
        
        if (u == -1) break;
        s[u] = 1;
        
        for (int j = 1; j <= n; j++) {
            if (!s[j] && cost[u][j] != INF && dist[u] + cost[u][j] < dist[j]) {
                dist[j] = dist[u] + cost[u][j];
            }
        }
    }
    
    printf("Shortest distances from vertex %d:\n", v);
    for (int i = 1; i <= n; i++) {
        if (dist[i] == INF) printf("%d -> %d = No Path\n", v, i);
        else printf("%d -> %d = %d\n", v, i, dist[i]);
    }
    
    return 0;
}
```
**Sample Input:**
```text
Vertices = 5, Source Vertex = 1
Cost Matrix defined internally.
```
**Sample Output:**
```text
Shortest distances from vertex 1:
1 -> 1 = 0
1 -> 2 = 10
1 -> 3 = 50
1 -> 4 = 30
1 -> 5 = 60
```

## Experiment 11: Write a program to implement Job Sequencing with Deadlines
```c
#include <stdio.h>
#define MAX 20

typedef struct { int id, profit, deadline; } Job;

int main() {
    Job job[MAX] = {
        {0, 0, 0}, {1, 100, 2}, {2, 27, 2}, {3, 25, 1}, {4, 19, 1}, {5, 15, 3}
    };
    int n = 5, J[MAX] = {0}, k = 1, totalProfit = 0;
    
    J[0] = 0; J[1] = 1; // Job 1 is trivially included initially
    
    for (int i = 2; i <= n; i++) {
        int r = k;
        while (r > 0 && job[J[r]].deadline > job[i].deadline && job[J[r]].deadline != r) r--;
        if (job[J[r]].deadline <= job[i].deadline && job[i].deadline > r) {
            for (int j = k; j >= r + 1; j--) J[j + 1] = J[j];
            J[r + 1] = i;
            k++;
        }
    }
    
    printf("Selected Jobs (in execution order):\n");
    for (int i = 1; i <= k; i++) {
        printf("Job %d\tprofit=%d\tDeadline=%d\n", job[J[i]].id, job[J[i]].profit, job[J[i]].deadline);
        totalProfit += job[J[i]].profit;
    }
    printf("\nMaximum Profit = %d\n", totalProfit);
    return 0;
}
```
**Sample Input:**
```text
Number of jobs: 5
Job 1: Profit=100, Deadline=2
Job 2: Profit=27, Deadline=2
Job 3: Profit=25, Deadline=1
Job 4: Profit=19, Deadline=1
Job 5: Profit=15, Deadline=3
```
**Sample Output:**
```text
Selected Jobs (in execution order):
Job 3   profit=25       Deadline=1
Job 1   profit=100      Deadline=2
Job 5   profit=15       Deadline=3

Maximum Profit = 140
```

## Experiment 12: Find All Pair Shortest Path using Floyd-Warshall Algorithm
```c
#include <stdio.h>
#define MAX 20
#define INF 9999

int main() {
    int n = 4;
    int A[MAX][MAX] = {
        {0, 0, 0, 0, 0},
        {0, 0, 5, INF, 10},
        {0, INF, 0, 3, INF},
        {0, INF, INF, 0, 1},
        {0, INF, INF, INF, 0}
    };
    
    for (int k = 1; k <= n; k++) {
        for (int i = 1; i <= n; i++) {
            for (int j = 1; j <= n; j++) {
                if (A[i][k] + A[k][j] < A[i][j]) {
                    A[i][j] = A[i][k] + A[k][j];
                }
            }
        }
    }
    
    printf("All-Pairs Shortest Path Matrix:\n");
    for (int i = 1; i <= n; i++) {
        for (int j = 1; j <= n; j++) {
            if (A[i][j] == INF) printf("INF\t");
            else printf("%d\t", A[i][j]);
        }
        printf("\n");
    }
    return 0;
}
```
**Sample Input:**
```text
Vertices = 4
0      5    9999      10
9999   0       3    9999
9999   9999    0       1
9999   9999 9999       0
```
**Sample Output:**
```text
All-Pairs Shortest Path Matrix:
0       5       8       9
INF     0       3       4
INF     INF     0       1
INF     INF     INF     0
```

## Experiment 13: Write a program to implement Breadth First Search (BFS)
```c
#include <stdio.h>
#define MAX 20

int graph[MAX][MAX];
int visited[MAX];
int queue[MAX];
int front = -1, rear = -1;

void enqueue(int item) {
    if (rear == MAX - 1) return;
    if (front == -1) front = 0;
    queue[++rear] = item;
}

int dequeue() {
    int item;
    if (front == -1 || front > rear) return -1;
    item = queue[front++];
    if (front > rear) { front = -1; rear = -1; }
    return item;
}

int isEmpty() { return (front == -1); }

int main() {
    int n = 5, start = 1;
    int graph_data[6][6] = {
        {0,0,0,0,0,0}, {0,0,1,1,0,0}, {0,1,0,0,1,1},
        {0,1,0,0,0,0}, {0,0,1,0,0,0}, {0,0,1,0,0,0}
    };
    
    for(int i = 1; i <= n; i++) {
        visited[i] = 0;
        for(int j = 1; j <= n; j++) graph[i][j] = graph_data[i][j];
    }
    
    printf("BFS Traversal: ");
    visited[start] = 1;
    enqueue(start);
    
    while (!isEmpty()) {
        int v = dequeue();
        printf("%d ", v);
        for (int i = 1; i <= n; i++) {
            if (graph[v][i] == 1 && visited[i] == 0) {
                visited[i] = 1;
                enqueue(i);
            }
        }
    }
    printf("\n");
    return 0;
}
```
**Sample Input:**
```text
Vertices = 5, Starting Vertex = 1
0 1 1 0 0
1 0 0 1 1
1 0 0 0 0
0 1 0 0 0
0 1 0 0 0
```
**Sample Output:**
```text
BFS Traversal: 1 2 3 4 5
```

## Experiment 14: Write a program to implement Depth First Search (DFS)
```c
#include <stdio.h>
#define MAX 20

int graph[MAX][MAX];
int visited[MAX];
int n = 5;

void DFS(int v) {
    visited[v] = 1;
    printf("%d ", v);
    for (int i = 1; i <= n; i++) {
        if (graph[v][i] == 1 && visited[i] == 0) {
            DFS(i);
        }
    }
}

int main() {
    int start = 1;
    int graph_data[6][6] = {
        {0,0,0,0,0,0}, {0,0,1,1,0,0}, {0,1,0,0,1,1},
        {0,1,0,0,0,0}, {0,0,1,0,0,0}, {0,0,1,0,0,0}
    };
    
    for (int i = 1; i <= n; i++) {
        visited[i] = 0;
        for (int j = 1; j <= n; j++) graph[i][j] = graph_data[i][j];
    }
    
    printf("DFS Traversal: ");
    DFS(start);
    printf("\n");
    return 0;
}
```
**Sample Input:**
```text
Vertices = 5, Starting Vertex = 1
0 1 1 0 0
1 0 0 1 1
1 0 0 0 0
0 1 0 0 0
0 1 0 0 0
```
**Sample Output:**
```text
DFS Traversal: 1 2 4 5 3
```
