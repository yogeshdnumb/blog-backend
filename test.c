// Online C compiler to run C program online
#include <stdio.h>

int main()
{

  int arr[3][3];

  for (int i = 0; i < 3; i++)
  {
    // i=0

    for (int j = 0; j < 3; j++)
    {
      printf("%d %d Enter: ", i, j);
      scanf("%d", &arr[i][j]);
        }
  }

  for (int i = 0; i < 3; i++)
  {
    // i=0

    for (int j = 0; j < 3; j++)
    {
      printf("%d %d ", arr[i][j]);
    }
  }
  return 0;
}
