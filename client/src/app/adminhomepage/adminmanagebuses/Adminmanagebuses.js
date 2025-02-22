"use client";

import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import * as Dialog from "@radix-ui/react-dialog";

const initialBuses = [
  {
    company: "Mash Poa",
    name: "NRBMSA01",
    seats: 55,
    availableSeats: 35,
    price: 1500,
    route: "NRB TO MSA",
    time: "9AM",
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQBDgMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAEAAIDBQYBBwj/xABFEAACAQMCAwUFBgMDCwUBAAABAgMABBEFIRIxQQYTIlFhBxRxgZEjMkJyobEVwdEzUoIkQ2JjkqKjssLS4TRTc/DxFv/EABoBAAMBAQEBAAAAAAAAAAAAAAABAgMEBQb/xAAkEQACAgIBBAMBAQEAAAAAAAAAAQIRAxIhBBMxURRBYSJCBf/aAAwDAQACEQMRAD8AwHDXQtTBKcEr2TxaIlWngVIEp4SpZQ1RUiiuiOpVTapZSGhdqcEqQJtUqJSKIRFThDmiVjqQR0rGBdxSMOKPEVPEIIpWOitEJPIV3ucc6slgZTlc/EU1oGJywNGwUBLCD+ID40/ulwAW/pRHu/pXe4osKIZIQhThYHi6LXELRsCowan7ql3TcQA5Uhlnaazdx25gUBuIcIGKGmtbm0k4pUkiJ5k7Z61eaFJaW0IjkjR3O/HjOK0OuRi60ZlfHLOfLyrl31lVHTptG7POHizuOtMMNGrHIGKldx0ouC1lYM3chh6Het9zHt2VAWnoKsGsWdgsYPETsB1PlTTZSxXKW0w4WJ3JGcU90LtsgWPi3p3dVYS2UUDkLLxKOZ86ns4oHVgV4jispZTVYiohJ7zhArQ6PDKkysBs5qMaZkF4wCF54q60uylQKSdxuKxlks2jjoMk06WWJ3Xhx1AqGCxiePHi7wcvKrmVpjAkXAo4sjnTo0EMO0fE4GCANqzUjTUzEttwEqeed6asBztVvcQzLmSWAhT1xyrlq0DDAXPrVbE6laIGFSxxYzxE/KrlbVJV8NPjsMDbHzpbDo8GEdOEdEiL0pwir1zxwcR1IkdELD6VKkPpUspA6w1KsHpRSQ+lERw7cqzbNEgJbdjyU/SnCBhzAq1hjAwSM0db9yrZMYz6gGoczRRsz6x9cVIsdXtzDby+IRhT0xQvupHTakpWJwoBWKpVioxbb0qVbY4zjaiwoCEVO7oHarAW3mKctqPKpbKorhajG1SQadNcNwwRO5HPyHxqyFpnlT4laNjCrNnGSBS2GolK9i6sVYEMDgiiLLSHuWPCyqFGWDHG3nVq0JZskAGjdPszIftJAkSHccs1LmyoxVgMejCMAwsHBODjpVvBYCKAi9mXu3GMPv8AT1olhZIvBH4SOTio5VhuQoZuvlyrB23Z0JJKjPSW0BDxw8RVCcOy5LeW9T6ZZsrgjNWxs4hKvcDw/i4uVE28SRPiN9jt6USkxxSA10sQzG4skcSKCQy8jt5HrQx08oe9vlcsR4KvZL2KI/Zrn0pjSLcjLpuee3Opt0OlZm5dNWVgExxN0qAaVMGIClHFa+2tkMpLJg52OOVFTRRKvFIF/nStjpGQ94S1tWimjHHw+Er1qz0GeS5ZRIyjB2xRN5p0N2ANxv4ARXdK09rYtjYryNSVaLa4t45I/EwBHXPWmzyparG0iku3hHWmSq3dMrvl2HXkDVVL3vfN35PEeuc1SQmw69uJVTgiePx7lQcn51XC3aMM8zGNcZ88/KirdUAzgk+tWEKx3AHeLhhyBpt0hIoI762QkyXEqjyKYzXX1u2TZTIPi1WV/ovf5YxoGPkaAn7McTgxbDG9ZORokeZiD0p6258qsFt/Splt/SvZ2PH1K5YPSpUt/SrFLbPSiI7X0rNzKUSujt/SiEt/SrKO19KJS0AHKocjRRKyO29KIS3HlVilqPKpkth5Vm5GiiVyWuelTLZ+lWSQAdKgv5/cUDhOI9RnGB51OxWoFItvAyLNIql/ug7ZqIywrBNJjuzGcAMOYzjNMa8t9TvY0Xu5IwuzBjgnIxtjaory2iFtJcFsoSY2wN0+O9LYNUG6eVuoxhfF1XqKO9yCDJG2M1mtOlmsYISWEit4ldcnI8s1oJNVVkxDhZckYPLGOf6Utx6kk8TQW7yxqCQuRnYH51mLXVfe7wzKJYhjgZCCVU5+FWVze3UmjyOV4BIw34thkfpsKgeJJLNJrGPwiPZNyQRz5c6lzKUS8kNvG0Cn/O7A+vlU/ueFIIOKzzXPFEjzh+7QeFl2KHB223zV1aXrxW0MgYSQnOxG538vOjcNSc2jHpTks39atolEqK6nIYZFSCEdaNg1KyK14WJYknFPW3B8xg5qy7kV0QgUqLRXyWr8ee7X49aKgjI37v5dKKCZ507hI5GpbKoFkaXIKgeu9DvMzvwt09KOCMpO2aaIVO/DuaQAjIj78eOHkPOu5l8IZuFSM7UYIFpzQFhjNO0Ir8vnc5waa0feMS3OjjZsType5sN8U7QwNI8HYUZHGwGwNEQxcCfd3qSKMt984+FSxoHEzRjDHf1qE3cmdjiip7Uk5GfmaGFo4J2qCjz1YR5VMkA8qLWH0qZIvSvQcjz1EFSEeVTpEPKiVh9KmSCoci1EgjjFExxg1KsFTJDgbCobLSGLD61KIR5VKkZHOpVTY5xgc9+VTZVEKwjy2qq7RW9rcaY4l4gQNn8qJ1PW7awSTiWQshwcLsPXNZoXV5qEJ95gBtrglGQKeJT0bGNh8alyQ6K57eC305RZTgXkmAX5EgHn6daCJupZbmGSUsO+LYOwB2GfrxU51gtL2BIHdgjEO25Xcc877Zoa7vDBMVUxvGAHPDud9ifTz+dc7mNIL0g2tspRmZncMOHGQMHmB51Z9ylrDFdygzRMOHeM5yPP05/ShdPE90i3PEJMrsioSdxzzWp0nSTNpi2qBlV1yPNTn8RIwOX68qak2PUz8VyLnTI7FgF4gO4eN9nGxGT575qaINpLQK0rccmOCPOVOeYH71aQ9jJ44IbiArFOGUtHI+VwOfIHHPlVk3Z2W5EL3F1ErwklWiTiK5HTNXq2IqtYKPCRBHGFAJLMNs4wDn4k0HELuVraQwR+6oSXkHhPpj1G9au30CNLNYLm6ubkAEFiQM525D4n/wC4wdDYW0FqkAhHcxrw8LHiAHkc1WnIyv0vhtnSAs7Mdhvxeu9W+M7+dAXOt6JpYzdahYWudsNMqn6czQsXbHs1I4RNZtSfzH98YqqSFyXOD5Glg+RrvvMPu4uBPH3BXjEvF4eHzzUd3f2tlZG9urqOK1UcRmdsKB55qtQtko+FdBqii7c9l5fu65ZD878P74qytdT06/wdPv7S5zy7mdXP6GpcGPYLLHypBj1NN4hv4jtzppYZ3NQykS8VdGelRhPXp51Q6lrjWV20fdjIbhXJwD6ny6/SlskOjSAnP3qeOL+9msqO0yPJi3A4Fbhk4hyyMg58uY+NaS1lE0CSKfvAGluh6sJGSN66AByqNWp4PrRYh4pY9KYJEzjiBPxp3GCcDNCkgMSY1RCzlVA55NAya1pkDlXuU25kchXnnabtnPezd3ayKLcIPCrc2xvnzrNwyzSyZ4if51Us3oyUD2mLtBpLY/ylRnlmpk7QaTxlVuVJB+teOrMQBhj8/PNdDyZDA8ueelZd+ZeiPdLS9trleKGVWGcZzXDrWnR6lHp8lwgnkGVHT4ZrxO21SWG3kjDsFIyN6M7N3kK3M1/fxtcrbR94V7zgLEsqqCem7CnHM5Bqj3CViiBscUbA7rQyzNDE2UZ8qWVSOZ8q8wv/AGr3lpDIum6fpsUNuQqrJM7s22fDtj9aqdU9rfaIqgsryw8QywjtjlP8RO9a+RUel2tjcavqjyzW7IqANGxjKg5yeXnjr61PqWi6hd6aLVltkk4gouGOOBOWfjjpXlcHa3tDfRQ3Nx2luOBvFJCYOBQMfhIG/wBelMsNfjisVn17ULt52X+zLk4P13p6oD1FOzfZ2zcTahfd9KFCniue7QAdAq8h86jl1LsDpgIkk0oOqhmBHett13zmvJB2r0kXAfup2UgZBUAk+Z9KqNd7SWWpTuU0eFANldZWViPXHMelOkgPZ7j2n9jUHdwGe6bmqRWjfoCMYqo1D206faIYrXQ73iwcLOVhB/f9q8d03W59NA93gtjIM/ayRZfHlnPKnXvaLUr3j76cYdShAQcvLfJpbDo9Ut/azrurS91pmh2sbYye8d5AB9FH60Dqfbrt53oi47eNsE5s7dG4R8XY715eup3scKQxXMscaZ4Vjbhx9KjnvLi4GJ55pR/rJC370WOjbJ2r7UatGS2r3rIrcMrCdYQvyUCnXUelXEZ9+7QNdHGR3s6yqD/icn6CsCCNuIZqUS/ZbtgZOB5UWIvrloYYgLcwsufC8a8IYeYqIai8bbS8PzqmMkeAGJYDzp63WD/ZJjzIoGeo9mL3Tu02gJpPaK6nghs7pfd5IJOBm487E4xjJ+tG617NrfRtVsLg3Nxd6VPOsZMjeOJm2GTy+e1ZrsEqX3Z7tPx7tFbo6oNhhTnNb3+PTW2lw6ZdWIutOzFG9w0hZlLeJfpjzqrJo43YmytlkWCXxJJwn7T8Nd//AJSHMUqkoV3BznBHUbbGiri2065ubnuscV3GvdbkcLDPOgQgjjMLNKHVg2BI1VB80yZrjg0lr2ht7IQW+r6jGs0rCOB3wruc4A25nf060r3UNXt9W7xbXvdOAAITc5zzrJ6XpVpqvaO5nv0eRbCSMQqzZGSOfxBwflWp1a2FpEJ7S/e1uMnhIywb/RI65rLK1dF4laLQX0vfK6cRjbYBevpWN1+aQXE/EpWWN+NFLc/5Vo7K/sJJBNp9yrwtJwunLhc7mhu0tlBNaXUluvHICM8Q2ZTgH+X0rnm/o6IoxJuriOORYpQ3G/CzfM8vrVjZ6xfWax9zO/HnYn0GAKAurZ47qWJWZhxkgsdsfD4UTbRr/nBnbBI6VxSm0zpUUzR6P2ou4AwvWaVTyLbYNba0vUuII5BOnj5CvMZ4E2KqSAoJ8qKspJEdSkjKF3GOhpLPJClhi1weoqM4DBfpT+4VjklvrVDo2q973cUzl2Ycz0rQK4xzrvxSU1Zxzi4s+O5ZGY42IAON6stOLGMYNMhtdPWW5Wa7HhjHAUzu+4IHzGfgRROlBViXiyMjqKJeDNE0rKhJLDA3IHWmpMwkOTgEdMmuzrEWClwM7fdrkBty7RK7unEeg2qYfo2DXL+M4yQMjfpTY5pE0fWlz4WgjU7/AOujI/airmyjlKvHJu4ByfMdKP0fTVSDV2mQmLigRA4GGDMzZ+qD61SkoqysON5ciivswofKhSQB8aWN8Df1xmvSdKt7KDUbaVrWB41nVWDRgjfofrXqyafYpkx2NoBnmIE/pWuKSyfR0dV00unaTd2fMY79wq8MnCOWFOOfwrvu1xISFhuHOcj7Mn+VfTgWZXIitrcID4SMDI+nwqQvfbELGOf4ztWupyWfM0ei6nIPBpt43oIWNTp2W7QPuuiaiR0xbN/SvpiF5+D/ACgjj8lOaecnrScQTs+bE7F9ppf7PQ7445/ZYwaJj9nnayQAro0w/NIi/u1e3uk7yA2QdSqYn7shCXzzyfnUZttcllRZpgIRnJil4SfDjf8AxAH50ococuGeNp7M+18jYGkhfz3MI/66Ki9lHal+cVmm+MNcg/tmvUhp2sYKs8rKVC8C3JU54SCfvdTj68h0km0/VS92O9Z0lxwfbkYwoz12yaqibPLJ/ZL2ojiLILGZ+kaXGGP1AH1NZTVtF1PRpPd9UspbaQHI4xs3wPI/KvqGMMI1DbsAATmh9W0yy1nT3stTt1ngf8Lc1PmD0PrRQ0z5WbI5ijMlLe3PBGYmHM8ycmtZ209n932baS7tVe903o4Pii/MB+9Y8FSYCSe7UAOM/WoGbf2SuDqWsWbbe86ewx543qTSJtZvbFrW0nR4C0Mzxs5DBk3GAOf/AIqL2XSQydvIhajCPbSpg+RWri3tTo2myXgcETy8AKcwQ5225bVSZLReEXBiM/A0abOSfj/5qwsp3u0YzeKQEcJI5j1rO6Bf97a3MNxLsFIXvH5nO37GrXT7iFcgzxhs7DvBWqM2XVgkKy3KROe/uUyy8GyHHDsc7+fSvKNR7QanqErNe3XF4uEcPCo25YA5V6zYpBxi8RV75cJxBugOcV5pfafpgae2aMq8dzJxSLniOGYYHT/8rk6qlTZridICsL64tLR4u+mRWlDKQdiD/SvRLvVUi7PGD3gJMIchjluPK454xzrET3EPu0VrFbk28fFgFRvnH9KKm7QapNbXFuJkWO42b7NeIKOQB6Yrk7ifLNVLgKl1eFHXxSu74c4PDzHl16D5GiDqwlRFjRhw7kDyrPiNpWVmAHD/AHRvnAGfnjPxo+z72A/ZtJk5GxPWs5SgbRyGjt733uFEW3kkYEDAXmeX7kUoboqSpXhfqOHFAWhuFIZCyb58LY32/oKPhIUZYZbqa5Z5ImiyFzpdw6zoxDZBzgHFaQ6zOpz4ADyBIrFJcsvI/pXfeWx980o9RKPCJlTPPHsVJykik+eBUL2Uq8pcj8lW4tHb+z4JP/iYN+1Na3KHDRsPQivV+PJf6PPKX3eTqOP1C0hmDOIGGevDVz3KE9R86fHCoO2fjxGjszHTKZDIfEpCkDAFXWkmRNNvkdsYkgwPlKaeIznILGipcLokqIT3huYzjmSoSQfzFRLFkSdnV0TrPFv2FTaatvbLdq7F+KMGMpuCSM5Ofj0r0eJSEQhDyB55zXklv45FkdhxcYzkbneoBqOp3XtLa/tpcxW8ywmN3wDFtxDHw3+QrTpX5PR/60Uowr9PYwg4clGArgjUuRhhsMb14z2r7TalH7Qrie1upEi0+VYkjDEIQMcQIGx4jmvZYJ1mRJUxwOilemxGa7LPFJFjUMwyfrTu7XbdvrSU5ZidgMUiSADTEJUGPvNy86QQDcM4P5qSnYZ8hSzRXAXbEI1/vP8A7VIRjiPifmR940gacp8R/MaAGBFOPG4JH940uBP/AHJP9o1lu3fbSPsnZ26xQLc39yD3UTEhVX+82Oe+2Ns+dVXYL2iDXLtdM1G0itbhwTC8TEpIeowckH5nNK0FG5uYFliaNbiROLGT97bqMHzrzPtv7NMo952dXKM/eSWfMg+cfn+X6b4B9UBzQlrLfe+3C3ZtRZkL7sY2bvDseLjzt5cqKCzxH2YxNbdv7KNiv4kOM7HHLfr6VP2zF72Z1fUNIljLW15IZraQkrnJzkdMg7V7DcabpseoR6lFZ2630kqBrhIwHIyOoqbtP2d07tVo7adqPCsn3oJlxxxN5geXmOtTQ0z58hm1cA93aXZU8x7sxz+lGjU9eIAitbjOPw2LZ/arbU/Zv200uZls3nv7b8D2s7DPxXORQ9n2H7YOe8utM1KV1P8AZSTcKn4kk/tTthSH6Nq3amO44JEveFgcLJaGNT/ixtUssNzcXU01zbvbSyPxNHkHBPM+mdz86R9nXbO8uxwWdpZxB+JUE0ahD5nHP5itNr+gzaG+m2QuFnuhbZuHGFGeJuS+W/DnmeGuXq7eMKM7HYn4+vEKLissdF+OaI7m4CrxhtxudqeYJwPB4h0HHkn9K8luTKURq2/CMjuz86lVcDknyNDRPNIwRQeM/hI/nT2S4U+O2k+PFWekmWgoDG//AFU7P5vqarjI4kKdzg42DdacHc7iBht0pPHItMP4s7DPzNdyw5Y+ZqvEjAHhikB8iDSM743VwfIZpdtlbGU74eVTR30sW0c0qjyVyKCzSBr6c4yzXWLkbcYYeTIDn9KX8YcghrW3PqqlSP1qsroxQMNOpz8XgbgHkN67/FLgb95+lAkDyppFFJ+QTa8B3v2ot4oeEldx93+dAzXmpQPcStazBpZBKzCI4Dj16A1zhNOWSVGysjD4GpUIrwi5ZZypN+CJNbhlutWuryMCa8xMoIziTO4+Byf0rV2HtQhi0+K0ktZonRETvY8blQBn54rP++XDAiR+8B6SKGH0NRn3dxiSytW/Knd/8uKKJ2PQrb2q6NI/23eR5x+A1YaZ7QNENukc+oRNJxsSc8OQWJG3oCB8q8qa102QYa1ljPnFP/3A1G2j6fJ9y5nj9JLfi/VWz/u0U/Y9l6PaX7V6fNZObK4iecL4FdwFJ9TmrKLWLGRF4bmMt1A3/avn59AjxmK9tGx0Mvdn/iBR+tO/gesInHAl4yjrC3eD/cJo/pBaPf31ONb63gQBopEcvLxAKhGMA588/pRaXUTM/AysFOchgc/CvnIXet2rcC6hPE4/A7EH6HeiF7R9pIt/fXk/OuaLkH8lr7WJXuu2/cZICQxRpnpxDP7mooLS0sGa4gZ4LmwnX7/NiMHb4jNZzU7y91K4N1eLxTcIUuoAzjlU+qaxLqEa8bkMFw4C89sZ9aQH0U95KsNpLBavMs5UNwkDu1b8W9FLKA8cZBJYZBA2FeM2ntVuYYkja0YBVC/ZyDoMcmB8qsYPa1GoAlt7xcekZ/kKNx6nqEq8Kht/FMh36b1U9sNLa+WOZYyxETx96n34j0IOxHM8qyae1TS5jGJnnVA6sy+677eob+VM1v2iWl1cKdK1yezhwOFf4bxknqSWcA7dNqpSsnWjddkNTvJ+z1i0kbGfgKyh2wcrtzNVGse0XRLC8kguJklkjPCwiJcA/Ks5ee0uxu9MOnzWl9cca4e4jmit3bPMjhJx+tZe3Tsq7eDRbgj/AF9+zf8AKFobBI2q+1bRVmXEDopbeTuT4R51F7Q9SEV7p90LtJfe7dmR1GQUUjB+ZZv9mqWyj0KP/wBNoumofOZWnP8AxCat5L67umVvfeAKMKkYCqo6AAVllSyR1Y9TLfxdpdveYAT/AKW9TW+o3WOFLm3Yjl4gK0X+UP8Aekjf88Sn+VNe14/v2li/5rSP+lcnxY/RVFKLi94cmZBjorZzUo1C8VOFQpPo2asf4fbNs2l6ex9EK/saYdG0/Of4LaKfNJJFP/NU/EXsKfspJzeTyd8xkUjblnFTwXd7Ghy4cH8JBqxfQdLbdtLuUPnHeuv9aaNE05Puw6mn5b4N+hWh9N+jp+yrm1S83VMIOgzk0M2qamoGI4m8yw3q9Oi2Y+5d6unyjb9yKYdDt85/jGprno1tH/3U1gaDkxwNOqx1nQdT0SXg1G0khXOBIRlG+DDb+dV+K9Iyo5XRSxXQKAFmlmu4pYFAjmaXOu4pYoA4QKRXNOxXQKAGYNLBqTFKgBoyK4EUNxBQG8wMGn4rmKBhMepX0a8K3czL/dkbjX6NkVwXpbae0s5R5mHgP+5w1Bw0uCiwomL6e4+00919Y7k7fIqf3oS5gtXbNt3uOokVRj6E1NwUuE5pBQJ7kjfgUD4UhpUTHoPlRoBpwFFFAS6LbE7tUy6JZnzokbV2p1HZEmjaevND9aKgsbaE5iRFPwpgJNPBPpRqFhUcZ6YouKOQeXyNVwdh1NSJO46mlqFlvEJMfi+uaKjaVRzOPWqVLtxyY/SiI76QY3+ppUNMuUlkxudvKplmYVUJfv1GR6URHqG+4K+pxSootVuUA3Xf1FSrOjcio+VVqahFyOPmtEJdWrDcp9f/ABSoA0Oh/umm8KdFWoA8Dcs/Ig1Iqx9BJ8hRQzW6HdSahayQ3gSVMAEMoPEMdfOsX7Seyuk6XaLf6dAbd2OGjRvsz/h6fLFKlWkDKR5wRSpUqsk5Xa5SpAdropUqAO0qVKmB2lSpUAKuilSoAcKcKVKkCHYpYHlSpUDEAKdgeVKlQB3ArhFKlQMVdpUqAHAmnqTSpUgHinjlXKVAEiU7jZeRpUqRSHJIc9OVEKxPOlSpDJk+8Kc0jp91sZpUqQ0f/9k="
  },
  {
    company: "Mash Poa",
    name: "NRBMSA02",
    seats: 55,
    availableSeats: 30,
    price: 1400,
    route: "NRB TO MSA",
    time: "11AM",
    image: "data:image/jpeg;base64,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"
  }
];

const ManageBuses = () => {
  const [buses, setBuses] = useState(initialBuses);
  const [editIndex, setEditIndex] = useState(null);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [editData, setEditData] = useState(null);

  const handleEdit = (index) => {
    setEditIndex(index);
    setEditData({ ...buses[index] });
  };

  const handleEditChange = (field, value) => {
    setEditData({ ...editData, [field]: value });
  };

  const handleEditSave = () => {
    const updatedBuses = [...buses];
    updatedBuses[editIndex] = editData;
    setBuses(updatedBuses);
    setEditIndex(null);
    setEditData(null);
  };

  const handleDelete = () => {
    setBuses(buses.filter((_, index) => index !== deleteIndex));
    setDeleteIndex(null);
  };

  return (
    <div className="bg-black min-h-screen flex flex-col items-center py-10">
      <h1 className="text-yellow-500 text-3xl font-bold mb-6">Admin Manage Buses</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {buses.map((bus, index) => (
          <Card key={index} className="bg-gray- text-black w-80">
            <img src={bus.image} alt="Bus" className="w-full h-40 object-cover" />
            <CardContent>
              <p><span className="font-bold">Company Name:</span> {bus.company}</p>
              <p><span className="font-bold">Name:</span> {bus.name}</p>
              <p><span className="font-bold">Number of seats:</span> {bus.seats} <span className="ml-2 font-bold">Available seats:</span> {bus.availableSeats}</p>
              <p><span className="font-bold">Price:</span> <span className="text-yellow-500">{bus.price}</span></p>
              <p><span className="font-bold">Route:</span> <span className="text-yellow-500">{bus.route}</span></p>
              <p><span className="font-bold">Time Of Travel:</span> <span className="text-yellow-500">{bus.time}</span></p>
              <div className="flex justify-between mt-4">
                <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => setDeleteIndex(index)}>
                  Delete
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleEdit(index)}>
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteIndex !== null && (
        <Dialog.Root open={true} onOpenChange={() => setDeleteIndex(null)}>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
          <Dialog.Content className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <Dialog.Title className="text-lg font-bold">Confirm Deletion</Dialog.Title>
              <p>Are you sure you want to delete this bus?</p>
              <div className="flex justify-end mt-4">
                <Button className="bg-gray-500 hover:bg-gray-600" onClick={() => setDeleteIndex(null)}>
                  Cancel
                </Button>
                <Button className="bg-red-600 hover:bg-red-700 ml-2" onClick={handleDelete}>
                  Delete
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Root>
      )}

      {/* Edit Bus Modal */}
      {editIndex !== null && (
        <Dialog.Root open={true} onOpenChange={() => setEditIndex(null)}>
          <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
          <Dialog.Content className="fixed inset-0 flex items-center justify-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
              <Dialog.Title className="text-lg font-bold">Edit Bus Details</Dialog.Title>
              <input type="text" className="w-full p-2 border rounded mb-2" value={editData.company} onChange={(e) => handleEditChange("company", e.target.value)} placeholder="Company Name" />
              <input type="text" className="w-full p-2 border rounded mb-2" value={editData.name} onChange={(e) => handleEditChange("name", e.target.value)} placeholder="Bus Name" />
              <input type="number" className="w-full p-2 border rounded mb-2" value={editData.price} onChange={(e) => handleEditChange("price", e.target.value)} placeholder="Price" />
              <input type="text" className="w-full p-2 border rounded mb-2" value={editData.route} onChange={(e) => handleEditChange("route", e.target.value)} placeholder="Route" />
              <input type="text" className="w-full p-2 border rounded mb-2" value={editData.time} onChange={(e) => handleEditChange("time", e.target.value)} placeholder="Time of Travel" />
              <div className="flex justify-end mt-4">
                <Button className="bg-gray-500 hover:bg-gray-600" onClick={() => setEditIndex(null)}>
                  Cancel
                </Button>
                <Button className="bg-green-600 hover:bg-green-700 ml-2" onClick={handleEditSave}>
                  Save
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Root>
      )}
    </div>
  );
};

export default ManageBuses;
