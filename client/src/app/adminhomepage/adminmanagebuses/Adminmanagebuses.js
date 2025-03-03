"use client";

import React, { useState } from "react";
import { Card  } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
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
    image: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQBDQMBIgACEQEDEQH/xAAcAAABBAMBAAAAAAAAAAAAAAAEAAIDBQEGBwj/xABEEAACAQMDAQUEBgYIBgMBAAABAgMABBEFEiExBhNBUWEUInGBBzKRobHBFSNCUtHwM1NicoKi4fEkY3OSstKDwvJD/8QAGgEAAwEBAQEAAAAAAAAAAAAAAAECAwQFBv/EACQRAAIDAAICAgIDAQAAAAAAAAABAhESAyEEMRNRFEEiQmEF/9oADAMBAAIRAxEAPwDQNtZC1MEpwSvZPFoiVakAp4SnhKllDVFSKKyI6lVOKllIaF4pwSpAnFSolIohEVOEOaJVKkEdKxgXcUjDijxFT+4BpWOitEJPQVnucdaslhdTlcgeYprW7dWBzRoKAlhz+0BUndLwC38KnFvWe4pWFEEkIRlCkMCM+7SjZo2BUYqfuqQibeB4UhotLfWLxrb2VQG3rtAA5xQkttcWcjCVZIvPdxmth0Oa0t4EiMaNJ/WbfGrjtND7TpY3Y3LyPjXNvMqOnGo2c8aGmmKjUSTONvPlRkNpKY2Pchh6HJrfZj8dlOFqRBij/wBHySMEhBZj0A8aUVk/ti2spCHOCSM4p7VC+N2DrHu5rPdcUfJaRQsQJMqKKtYYJIWG3LHx8qyfKax4intiWcACtm0SGWOUDACtzQy6YQN8YBXpkedX2l2kse05ywrCXJZtHjoln02QwGQbdnpUaWEbw+5u7wDx6VcXPfTIkOxBlc4zT2HdxHu4izHjGOhqFIvJq72+04+2sLAfCrW4hliG6eIqp8cdKfbNA6cL86rQslYIGFSxx4HvFs+lXHsayLkVIthgYGPnS0OjgojpwjokRelOEVeueODiOpEjohYfSpUh9KllIHWGpVg9DRSQ+lEJDx0rNs0SAltm8FP2U4QMOoq1hjC8kZo+37lWyYhn1ANQ5mijZryx+OKkWOry5gt5feEYU+GKG9lI8OKSlYnCgFYs1KsVGLbelTLbHGcUWFAIixTu6B4qwFt6U5bUeVS2VkrvZRjipINNmuSRBCz7ep6KPnVkLTPSnxBkLQozcDcQKWhqJSGxYEg5BHUEUXY6M9yS29FRfrBjirMwFmyQAT4Ufp9l3g3TSKsSnBUnGalzZUYqwCLR+729y25WPUeFWy2CJbMl/MNrDx5YeoolzZqAsXulejDxqOVILkrvb7qwdt2zo6So1yS2iaMrECAniV5PzozS7NlbBzg+lWYs4xN+qH6vx3c0VbRpE2FbKHwP5USkxxSARpht2kmsUdW2kEr+0PSh20/uSz3isZmGVx4davHv44m/VLnyHlTSUuMEp48gipt0OlZrUuliRtsWC3XFQjS5gTtGxh1FbhZ2ybyxX3s9cURPFCozIoyfKlbHSNQlu0gte6eMCUYxt4Hxq60CSS5wZWXIHhSvNLhuyp53fs5HhRGlWT28ZKHaw6VJVosrm3jba+4BgeDnGTTbidLeRFZD3sg+yo7hX7rar5kyGBPgfSqpu8Mj98TvJ55qkuhNhl/NKR3EbRkHqE5+2gDCYI2adzGB0AGSfvo2AKoBCkmj4o0uAGZB3ngGpt0hI1+O/tYwTJcS9eEKYpPrlunClx6FqsLzQ++cMY1BJycGgpuy+6QmPhT4Vlo0SOaCD0p6258qsFt/Splt/SvZ0ePkrlg9KlS39KsUts+FER2o8qzcylEro7f0ohLf0qyjtfSiUtAB0qHI0USsjtvSiEtx5VZJajyqVLYeVZuRoolclrnwqZbP0qyWAAUPqFx7Aqvsz+8M4wPM+lTorIHItvC6JNIqs/1QfGoXmhS2klxsZTjafEU03dvqd+oUJJGF91gxOTxjjHHWoL+2iW0knL+4+UJH7Hx5paDJYWG26iGB7w+sPEUb7EE6jjGa1ywmmsI4A5EgPvBl5LD/AG/Cr2fVVaNu5wJAWBB6Y/kUtjyPu0a1tXmjQMyjIB4zWt2Gqe13bTqZUjkAUqykhSD06fzirC/vLl9IzIu1HbnnjHUjNRTxq1utxYx7o+7UqnUgAgHp16/CpcylEvJO4WaKL+sHu1N7HhcEeta890CEluO82qPckXqPTjnNXtrevDHAzESRMBjjn4gUbDJIbRz4GnJZv61bpGHVWU5VhkH0p4hHjRoMlbFa7CxJJJ8aeluCV6jB4qx7kVlYgKVFor2tnEmTGuKLgjK8hOfAHwokJnrTirYwDxUsqgV2lDZXGPGhzMZH9/kA+VGhWGeM1gQL+71oAEKKQH3+8Oi1nMu7DNtAGRijVgHzrL25Ydc07QivBYMCeaZ3O8lj18aP9ibPSl7Gy+FFjBI4+eBRiI4HAINEJHsjwF96pI4iw98nPpUsaBjOyLg9fWoPa5c8NiiZrUknGftqAWjj9moKOerCPKpkgHlRaw+lTJF6V6DkeeogqQjyqdIh5USsPpUyQVDkWokEcYoqOMEVIsHpU6Q4HAqGy0iNYalEIqVIyOtShMAk4AHU56VNlUQrCB1HFU/aa2tbnTGEhZGxgSeVFaprltYRyDbIXU7Theh8K1vv7zUINl3CDbXOQVVTmMjkMeOBxUuSHQBLBDb2MIsJgt3IV3t0JUc59PGgP+InM0UkpIErHngD1/GnYgtb2FIJHKJlWc5K5K9c4PGTQ93em3lZQUaNQG93kjPjXO5jSDNJa1ggaJi7PJGfdxu2jkcDz/KrGWGO0gS5n/WxyJgN3ZByB1P8+FD2ST3Ce0ZEu+MqESMkjIB69fL/AEraLHSDcaStrGDt2Bl9D5MSMf7+FNSbHkoHuDeafHZMqpLjMRR/dYAefnREJOlXMEBlYvI3uRk5UqcEgfDP2CrOPsbPAsFxbFI5QcvHK+5QMegqwk7OSXJhmmu0jlhVlSSGPcVz5E1eWxFRrLIVPs8caoviw4+I++h4EupJ7eSWGNbULtMinHvHgEVtMegQ+xpb3U9xcgJtJLAbvkOlWC2VtHAsbQqYkAAD8gfbVY7GAaUVgZbfLs4Ugc7sYA6/aKtcZ5qtudf0LTRi61Kwti37JmVSfl1PhUEPbDs3K+2PWbQn1YgfbjFVSQuy4wfI1nB8jSluIoojNLMiRAA94zALg9OfWodR1Oz0uz9s1C7jt7bj9bI2F56fbVZC2T/Ksg1Rxdt+y8p93XbAf35dn44qzttQsr4BrC9trgEZ/Uyq/wCBqXBj0Elj5Ugx8TTNwIzu8cVgsM8moZSJd1ZGecHpTNnXnpWu3PaA290Y2jH1iCN2BgHr8cUtJDpmzqT+9Txu881qsfaVZJQYsdzllYsOhH8RjFbPGwKAg/H0pbTHl/smxnrThgdKjU9eacD60WIePhSx6CmrInQMD8DS3g9M/OnpAaUY1RCzlVA65NAya3pcDFXuU46kdBXPO03bOe9m7u1kUW4Qe6rdWxznzrW4ZZpZM7ifzpy5voyUDtMXaDSWx/xKjPTNTR9oNJLFVuVJB+VcdWY4GGOPXzzWQ8mQwPTrnwrL55l4R3S1vLa4XdDKpGcZzWBrWnLqS6e9wnfsMgeH21xO31SWG2li3sFIyMGjuzV5DHNPqF/E1ytugYr3uzcSwC5PxIpx5nIMo7dMxRM7d0bA8rQwneCB8oz+4WVSOSfL51y/UPpYvbWF/wBHWGmRwwttVHld2bjw4x99VOq/S12jwq2V7YYIy3d2xBX5k81r7FR0yz0+41XUJZpoGTaMoxjKg5yen89am1XRL+/0+O2cW0Um/a1wWxtT+fCuWJ2r7QXcMdxP2luSrKWaIw7AOP2SBzz60207QQwWKza5f3clyV/o95OD1x15p5QHUF7O9m7OQzX9730pUBi9z3agADgKp4HHTNRy6r2B0sHfJpYZAGb3O9YevOa5InavSVuN5hnZCBwVAOfM+nNUuudorPU5pCmkQx54V1kYEj1x1p1FegO03H0odjkxHbi4u3HvKkdq33ZGMVT6h9NVjaqYbTQrzf8AuXDrD88DP4VyDTtduNNUezQWpkwQZXiy5B8M56Vi+7Qajfd4J5wRIu1hsHI8s9aWh0dXtvpW1/VnKaZolpHgZJkZ5AB/lH31Xal277ed6YzJFEyrlmsrdGwPLLk84FcxGqXyxpHHdzRogwqo+3A+VRT3c9wMTzSy/wDUkLfjRYUbxF2n7S6vEkkus3pgJxJJ7SIgPkuKbexaTPE5u9eN1IAWQzyrKoOPVyfsFaICvBdc1L3n6oZfHXA8qLAvrmSKJVEHdbQ3usi7QV8D86iXUnjPEu351TGSPjOSB0zT1usHmFPmKBnV+zs2ldsdH02x7R3dzby2dy1natby7O8DKGG7gjPBA+HrU939G0Gkdo7FLm4mutOu3KRSs2Gjcjof4+Na32RRLrsNrkzcyQahaPtBxsXcFyPLhm59K6DL2gkWO20zUbDv7GOdIVuy5ZjIFDg+XTjr1qrJoHPYyzgixDJyrFWHefZUo7MRwzR3MLvC6jcjKcsrf2TjIqa4tLGZrpIMd7KwliwSBgDJHxoQKqqkW6UNG+MCRvGr433TImuujZ7LtFbJNBZahfxC+n4iXhWlx6D/AEqL9I6tBq7NcWhfT3YKhj52+prWOzOlWeoazdaleo7zW9wYYdzfVGPrA/z1rYtUjGmvDPbag0BDqZUOWWVA2WXHntzz4VhytXRrxq42W6Xk/e8bnWQe6F6MPPNaNqs0olJ+pLHIRhjwAfjW26bd2DPG1hcrJZyMyIOm3B5GPTmq7tDYQSRK8APM4WQsPDPWuebZvBGmi6uBAkMcmUduW6E8D+Bq1ttb1C2CrBcPvIOSfHNVTQSCQxgklCTljkH/AFo62RP2xn1rjlOSZ05TNn0btTPHGsd6WkJOFdsVukNwsyoVmRiwyB1zXLZ4UWQkLkKRR9hPLDIHSZl29MeFJc8k+yZcKro6YoyfeAz8Kd7Oh5JY/OqnSNTFwRG7bnxndV0HGOtd/HJSVnJJNM8dSSMxxxgA45qz04sYxg1HFa6estys12PdjGwpnl+QQPmM/AiidKCrEu7cMjxFEvRmiaVlViSwxnOB401JmEhycA+WTWZliLBS4GePq1iA25Zo1d3TJ8BxUw/0bBbl/fOMkDIOfCks0i6HrKZG1kiB5/5qkfhRN1YxysrRycuAcnz8qsNI01Us9UaZMxd7EiBwOVJZsn7KpSUVZfDxPl5FFfs0TflQpYAfHisYOcDn/DmumaLb2MGqWkj2sDx9+EYNGCOePzrqiafYoMpY2g56iBf4VrxSXJ6Rt5XjS8dpN3Z5jHfvtG2TC9MKf4Vn2a4kOFguHbP9WT+VenAsysRFbW4UH3SMDI+ynl77ghYxx++a1yctnmePRdUkHuaZeN6CFjRCdlu0L/V0PUSPDFs38K9MRPPs/Xkb/EKcisvuKNtPvYOPjSa6BO2ebk7FdppRmPQ74+H9FjmiI/o77WSAFdGl/wAUiD8WrtzpcPKzaeHVAiK4jITMnvcnPXjbnz4qNrXXJpNs84EYBAMUu0k7QOf8QJ+dKPaCXTOOR/Rl2vkbH6KC/wB+6hH/ANqKi+iftTJjMdmmTjBuQfwzXUzp2sMHXvJcN9QC5I29OT73nz40+bT9VL3g7xmSWd5I/wBeRhecDr097OBj6vwqqFZyu4+iftRFEWjWyuG/q4rjk/8AcAPvrU9U0rUNIl9n1K0ltpVz7sgxn4eY9RXqXnx5PnQOu6NYa/p7WWqQCWMj3Wzhoz5qfA0UNM8svkdRijpMqkQMcZjKZUnrmtj7Zdhb7su0kqo15p7cJcqcbPRx/IrWVaPv4nkJMIA3DNQM3H6PZN2hds7McM+md+oHJzHuI+9hVhps+s3kSxwTJLZwXK3GzeQwYKQRjp0P3ChvoqEVz2q1SKEYjn0qePB8tyUdYRvpPZ2znL5N6kbhk8Tt5GRx/tVJktGxN7REizbWiQMGHnzVlZyvcxF5ADMGPJGNwrXtGvhPpksdxLlhgKHfyq00+4gC7e/jLZPu94PIVqjNlpGY4LHUFspf1xQze9GPcbGcdTnpXKL3XNQ1F+8vbkuW9QAfA4x6eHwrrsEEDRSTxKBJMuxyD1GCPzrmEtjpbRRR92ymInJTO5zx93H31x+U0mmzXidIi02/uLeC3tnnlTE7Ae97pXPB++uga7rEceliNZhHJHtBXBYvyD1xitJmvEzbqlvmK3AEYKjjDbh/CprrXdUvLR7WS4Xu5H3uRGocn4/dXLtPtmykHSatDHN3amWQjO45IHn0+P5UQ+q98UMaMAvUdcfZWviIyy94Qq9cBFxjJzVhZmWFdsbSYIweetZSlBGq5DYxeG7jVo7eRyAcYUnHH+hpQXR+qq4bPIxjmgLU3CD3WdB6Njz/AImjomVR097xNcs+SJouQv8ARbp4pw+CSPXFXv6anXrs56citLW5ZRwfupe0t++aI+TKKpEypnPHsVJykik+eBUL2Uq9Jcj+5VuLR2/o9kn/AEmDfhTWtyhw0bD0Ir1fx5L+x55S+zyeI3+oWkMwZxAwz47aue5jJ8R86fHCoPGfjuNHwzGkymTvD7ykKQMAVeaUZE0q7RjyJoQB8pKyIznILGi5jt0RkQnvDco2Opxsaolx8iTs6vCdc8WwqbTktoorpHZmMsQMewcEkZyc10dFKgEIfPrnNcktcPNHIzDd3i545PND2Wo6ndfSdLqUEuYornuHjd8ZhyAy49Bz8QK08V+z0P8ArRSUK/07GEG3lWArCxqXYYYdPGuNa72o1FPpEnuYLqRbezuBAItxCFRwwKjjk5NdmilEgEi42sAR4eFdlnjDljUFhk9fP0FOKL5t9tJTkuT4EfgKTHC59KdCEEH7zfbSCAchnH+KkDzz0xSzTroLtiWNf3n/AO6kIxknc/iPretZBpKfxP40gGhFOPfkzj940tif1kn/AHGtR7fduU7LRQW1tbpdX86ZEbsQqL+8ccn4cUP2B7fp2hl/R15bJa3oTdGI2JSUDrjPII8snz8DStBRt93bR3EJiMzhCffB94MPEc+Brl3bb6NXt1a70FTJahi7WuMtH57fFh6da61nIPw8qGspb3vbhb82oj3/APDdyzZKYH193Gc56cUUFnG/oei7rt33JZSGtZk3KeDjH8Krte9v7O3Nz2auImZYpA1tISQWTPusB6gc+ua7b+jdOtNWt720s4Irq4mPezRxgM/6uTril2y7Kaf2v0tbW5kWC9i962uVGXiPwzypxyPzqaGmcFgn1hRlLS6K53c2rEZ+yi/0nr54htbnpgbbFsj7qstQ+jvtxpsrxwC5vYf/AOclrcnB+Wcim2PYjtcSs1zpV/cOG5inmCp88k5+GMU7YUibQ9X7UI7JLFeMNu5UltjED8CRTRazPI7SxNbszEmPIO30JqW0+jftndX0ZaK0s41c7R3qBUGf3V6/jWxdotIk0rVEsrabvnjt071zgFn29dvhnGePOuPzLxYUa/HYnyz67hRcVljwUeuaIMMwID7uQDnOP9qy8NwikqNwHON3P4V5TcmUomFt9gyO7PzqZVx4L8jQ0RnlO2NSzY+qePvrJWcEb7aQZ/tZqMSZaCwMf/qnZH9r7are9fLL3PvLztPWn7mGf1DY9KT45FqQfuz0z8zWdzDpj5mq8SsB7sUmfEHIxSM74HD58QM0vjZWjVO+HlU0d/LEMRzSqPJXIFBZpA19OcZZrrFyON4YeTIDn7qX6YcghrW3/vKpUj76rKyMUDDTqk+73WKDyHNL9KXA57z7qCIB8KaRRSfsE2vQcL/Uid8G0lTuGNvX50BJe6lavPL7LMDJMJy3dHAcdefI/lS2mnJJKjZWRwfQ1KhFekXLlnKtP0QrrMDtqs1xGFnu379MjOHJyR9pNbfa/SnALWKB7WaFlKZePHO3GftxzWue2TsCJGEg8pFDD7DUZ9mcASWVq3ltUx/+JFFE6OhW30qaLIx70yRk4/YPkPH5VY6f2/0NrZI5r+JpOcnOM5J8K5S1ppsgw1rNGfOKb/2U1G2jae/1LqZPSS3z96kn/LRT+x6X0dpuO1djNYyNp08MlyB7iyOFUn1P21aLq+nycR3KHnHn+FefH0CPG6K8tH56d93Zz/8AJtpx0TWYl3wpeso8YiXH2pmj+SC0egP0knt6QLt7poi5mLAKGz0+NFJdRMJCjBgrHG1gdw68V5yW81u2bamozow/YZiCPkeaIXtJ2li59saTx99QfxouQfxD/pDMmofSFc27E4UxQp6DYD+ZqSxSz0ua21K2Z4JbK7XcrnkgMA4+ak1rF7eXl3em/uF/4gspLqByRgD7gKm1fVpNRBLOR7vvKBjn86QHo+4uJoZrdEtXlSZtsjqQBF6kVOsw7xY8HO3dnHFcdj+lm5LN3lm4DHOI5AcfAMpo6D6WogP10F2vh9WNv4UbBxOnsux7b1uc8/8ATaqHtrpks7NeQxt3htyBPH9eNlORzkEdTWuw/SnpMs9ubiScRJJuYey4I90jqGPn5UPq30h29xe79O16e1txjZENMDceO4u4Bz8qpSsWaOj6FqdzPo9pLs95oQz94wXafHOa1nUfpL0G2uZI3lEzKSv6sM6g+OMVr2r/AEjabqunHTp7C/eNhh5Y7mOBnHj9XPHpzWt20fZVz7mizHy7++dv/HbQ2CRvFp9KejSXkUQRoBI2O+aI4XPic1X9v9QNnroJuVZ5oFkJAPTOB9oAPzqv08aNBg2ej6ZEynIMkZmbPxkJq0lvLy6k71r5t3kMAfZWPNFckcseTVjqzzcC5gB9GqeHULtk2pcWzHGM7wK2HFw/1nif+/Cp/KmPaB/r2dg/960T+Fcv4q/RWSnNxe4BMqH+yrdakOo3gTaqg+e1s1YnTrVuG0rT3+ClfwNR/obT85/QtsuevdyyLn/NU/iL7Cn9lJJ7Y0pnzIrHzFFR3l7HFhmEgJ5GCDR76BpZ5OmXaE+Md86j8KwNF09eFj1SPyxeBvxWh+M/sdP7KmbU70ghML5DrQz6pqYPEUJHqOavTotoPqXurp/hjb8xTf0Hbg8azqY9Gto//amuBoOzTgadVjrOg6nosuzUbSSEZwJCMo3wYcfnVfivSMqMVkUsVkCgBZpZrOKWBQIxml1rOKWKAMECsFc0/FZAoAZg1nB8afSoAaCawqqrblAVv3l4P20/FYxQMJTUr5F2i7ldf3ZW7xfsbIrAvNwxPZ2cg8+57s/5NtQbaWyiwomLac/9JYSL/ajuOnyK/nQlxb27vut+8K/8xQD9xNTbKyAc0goD9hRuNigeWKQ0qInwHyo0A07FKigNdFtj1apV0Sy9ftokcdKzSyOyNNH09eqE/E0VBZW8H9CiKfhUYJNPBPpRkLC4428NuaLiSQf6Gq0Ow5yalSdxzk0shZbxiTH7dFI0qjk8etUqXb+DH7KIjv5Aeo+bUqHZcrK+PeORUqzMOuaqU1B8cqSPSiItQHiNvxApNFFotyg6qPmKlWZD0K/ZVcmoQnrt+a4qdLm1YdU+R/0pUAbuRh+yabtTwVRUIaA9M/Ig/nTwsfgJPkKKGbbody+oWkkN4ElTABDKCGGPHzrSvpJ7K6TpVqt/p0Bt3YgNGjfqz/h8Plis0q0gZSOcEUqVKrJMVmsUqQGayKVKgDNKlSpgZpUqVACrIpUqAHCnClSpAh2KWB5UqVAzIArOB5UqVAGcDyrBFKlQMVZpUqAHAnzp4PFKlSAeKf4UqVAD0p29l6GlSpFIfG5z4VOpJ6/zzSpUhk8f1qRldOFbApUqQz//2Q=="
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
          <Card key={index} className="bg-gray-900 text-white w-80">
            <img src={bus.image} alt="Bus" className="w-full h-40 object-cover" />
            <CardContent>
              <p><span className="font-bold">Company Name:</span> <span className="text-yellow-500">{bus.company}</span></p>
              <p><span className="font-bold">Name:</span> <span className="text-yellow-500">{bus.name}</span></p>
              <p><span className="font-bold">Number of seats:</span> <span className="text-yellow-500">{bus.seats}</span> <span className="ml-2 font-bold ">Available seats:</span> <span className="text-yellow-500">{bus.availableSeats}</span></p>
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
