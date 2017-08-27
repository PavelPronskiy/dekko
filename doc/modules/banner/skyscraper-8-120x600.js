/**
 * Version 0.18
 * banner element template
**/
(function($) {
	window.dekkoModule = function (object) {

		var css = {
			wrap: {
				'display' 				: 'none',
				'width' 				: '120px',
				'height' 				: '600px',
				'background' 			: "url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAJYCAMAAACeidL/AAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAJcEhZcwAACxMAAAsTAQCanBgAAAFxUExURQB0/wElQhwcHAfA1AnWtxWM4wcGBv///zKP/wAAAAIEBgN7wQ4NDQTNyXjsoSgoKG/ppVXjr1NTVSbYuwXFziiK/wXIzDs8PUDetBF+/xrVwEngsWLmqkVFRi6O/wjQxYK7/wXLzS8vMBUVFQFx+Dbbt4uMkEWf0nO33fT4/Ofy/xHSw2bnp9ra2hyD/9DQ0Pr8/gUQHU5NTgJBhQBMnwd4/2x9kgshOnV2eCAiJo3B/wBcxwbF0ZXH/T90r5OTk2hpagV5egTJwtL29qqqqtrr/1xkcXCx/7/Av3+AhKb00r7b/6bP/wNq5By3pqzd8F5fYbLW/83k/wIsTJycnO3t7YiIih/Wu0eb/4Pm6AM2agEwXYvpuwa+yluq1hmstOTk5FTaxjuU/1ml/wNjbCmRy8jk8g/P4GjHk2Hm1gRLW0KxvHbiuE7BnR2KxwaVjD5klMLzumiaoTfY3v+xdmw7NNhGXblNhtqba4tFlGXDsu82K4sAABv+SURBVHja7JnvT9tMEsed+NRFj0GRkCmXF60MiQD70XEWCQgSh3sI54tQCGkSqSKJ3EpAG5UXD9L1/5duZn/Ya0gcB+L0OWm/5cEbZ72fndmd2cGPpikpKSkpKSkpKSkpKSkp/XX0t18kBVZgBV49OJfLXcSaD7ncgH4c5HIP9CbVQ+bgC7jcRB9XB77hYLw+0ZuPD6CnlYCR8sQmIH2fMRjXFi8XbK1XCH5gCwqXx9WCLxjxkfFXCH5iPh6wpV4h+CbcVTerBTMk4vkHDKebVYAf0cnc4SKBXKwC/IDXC56sVgl+QuZD5PeVrfENxtNjLGOvDDzAaFo5mELF4bhSMKzvE0tfKwbjjhbtlYKfaAQ9rR58Q8E3mYMHj6DYmT/I8YQZVSAXGYCFYyPwY07srfD7x5WAH6LqLjOw+ktCgRV4LlhJSUlJ6f9LVagk8VrP5UZ4HeVyFU0T1VSFd2GNSi5UlfapsgdzdS32CL0OxtVOEhifK0sTGItBIzDyBguD8aEkcgc6dPigeB3QYeDDqALCETVaSeN3dbgDH8bsi5dg8Qhtguty43ICmT83Zlc+Dz5oODXWh3ukEj74DFzV5G/q8iBTNKbPlbn/Oszz8jN14dsFwVLXqaqEQOxWZ8spg2H1K9EQC4DhqXHytq5ws8bh5pbB8Hw9GmIx8CB5W4+w06CCTmbTiIEB1Rmwrb9Ui5k1o9y4ituKOV4eBVe/PAp312Lg0Zx4wpCp1HGASiw26uz7sZjPczCNn9yLRzh4lLy5MEw7MDqCq9i5E2UDblFFrMBzsFA9/kgUIEnhRFkIRbjGF1MahRpbD72WFlzujHjaSYqnehUfHsAm5BtRmixdXh7e6dc4Fwv+mfFUreDk0HRumfQQzaHlcPaLgJO5+GR1hIaygK3EwTyHjsW2TgkeVeY5mg5dHaOhaDp/OhqFp7KRuJE6nMZzLe6IlFinjXocXA0XbLQYGM/ZcjJ5IB0Q3D/RKNEZPFgM3JGOtNnxxPoMpoDHUZroLJa5RsmJSxhV5jMYaDGwmHc4/8XO4868eGLZvBKupEiH1fpzHySB2SPim/JgTsqkj8arujASR1WROQQwCSz2oHQsludsa2ZNVKyEo4RnqjjjFgDX5+cQJSUlJSUlJaVENYi15BHve47r9GtbKwYX24TYvkPIWux2u/28vWxwmzi3yL+P3T0k7eftJYPviSv5eKtnu32Yxz14gJAW68HbDdKyHBu/jfpxp7X6/IsaubMc93lzqnqkIXEd0ru2yS0sO3FqtVu+BVi7QXy37ROyJfXjYNu/7tG1qhHfhj5uvDlVPpF8fI3evCU+OqItOYW72t7ClbHkfnzCYiVqtE+P9GLNqXJw3kV05rWm2WgO/C5OB0MPrRXvF4l+UaN97ogda862uNjvO9DvkHBtTQdbfHypH3O11XZcwsDYB+woys0Za1wLJwwDWlTFuWDRjweGb903GLgWgWuJ4BZxigJ87JKPcdh0sNQP9ZG4xdDVvcjVvURXFx3S3xJLdE16x2yvSDtHtCOw1I+B7WPtuM/AbrS53MTNpa1BmPp9ny7RoUOcXtvpYYQQv90S0ULbEjjqhzqGuV/7HOxE4eQkhhNuDd+GXN24wyTVgLTdxvi87btOS5hM2xJY6oe6g+9rRZttriiBWIkJZLmqRWm1tvTDTIH/EmClJB3XHNd/XbRZPM+/SMNua14XugnsXr+YWKOQ2yzAPpljLtQWvcXA6brYJLmuLbp93y0uHXzv44He59m3UaR91yD5NqJz06qxsq9BtsJqD9O3RUcNu8sjWLEuU8E1l1zXWvS8aTvEL9JJusS2oqW4u8OZIZiWb+ihOxcOLNthYNY9NoIV6zLL1YcaP2GPaclpwZoeRqcmcbAwW4tXe21c9i0OZt1jI8S7JIFtckfrBQcf84/lP1wa+KsWr/Zc2r3BwKx7bAQr1iUBzEsjerHo+Fp4yN9iDeIcPyu6irRJwbR7fAQr1iU1WCrxb0VBeTsb3HgDGFZRclRDDmKn38fit/es2luLXN3gBXrM1XKXJHCDtKOt0ZCCmA4HhkMoS7VPG38VHRkcG8GKdUkCF30aDE4xDm6xQMKgihVdsAIQK74Mjo1gxbokgbViDcP/UIuD+/wvRjoDudqj2WFNBsdGsGJdlJSU/jqKTnWpqvol4MOab9t+jZ3edz0oV3v32YL5n6c2pEUoSZw7Vow6vi29SMgODCcA1h7FHk3QfZYn117/bjN8TTe9uONTsOjrk2NeLLTwWPz4xpeq4Wu66cVdBG6LvwctdDAcg8dvI4ev6aYXdxHYES8F7/H0v4W5tYpvXU169k0v7iJw+DLzlr5TuusTqSp+havD13TTa6xZFuMEYIkab3h/LV7TzQPH11j8gfdab0uv6aYXd7N2tahnPr4aHL6mm17cRWCM46KI42LrkL12f63F0mu66cVdBI4y1xr+/wMohB1CXp/Do9d004s7CYy52nVZrj62+lDr9W41JSUlJSUlJSUlJSUlJSWltOoYxvkbZHTKr6GWjZPPn69OX6+rz3sn552FuYD9Y/ssX1p/vUqFo6u98wWtPt/7o7D+7q1aX9/+fNJZjHuEtr4dvH52ugjZ2PuwvgQuJeevztPvq5M/SvnSu2VovbS+u2ekdvTnwln+3XK0ni99OimnNfhTfgk7KySf/SvlKnf2dndnGfyK+eRLp7FVBvPLZfzFLvibSTu/KuzOAJTyebFpJCWDS/nN0+000s5PC2ez3DbYpY2zXUmleb7e/rwZ6kjowzNtF7STT4VZni5tT7F47iIX9jbjOorw+I9qF8Cbu6V3S1T+DCz+BP8i7OZzm7e3CwXtP0e760sF50+nmxs3GMAfsgMDDBBMZ/iPKw/STpZu8dXmEcPCz4f8LOEaLxm8J3t5e/eFCoX8Wf4sK/DRprywR/LG2qbuzwws4ldmUixu6czAsV18JFsrDGbg3/79zyXpjIKlfCXcLKwVBhe0KwT/gyxJhQj8IktuywZnAv4a6F7g6dMlvsgE/EP3Lidxntn8qU903wlvZwLu6sFzOyfBTfAz+O4PgyzBL7h6U5pDluAUyg4cvPiRbA50Fse/wuIVg4OMwSZnmNF/JofSpu5lZbGpezEsj2bdE/AsXe0JGiN67IZJb2RksceH14eRtcz5jriR7eYKhsxiz+QOMJ0wgWQPbg51opPJZCcgevfSJN6wqdu6drp88LnOV9Sj4EtdnwBT/w4XcHVg6j90c5JF5vpvtKoIdmG9TYITaOrmZdA0ofUeU2YhAzDfXSaAmz90vau7aPEPpP8MgB9kBebhZE5A+g7s7cl7/Ok2cd3hTDa9pYNLocVzT6flg80USgLvGwfiQpuXhnG5b4C+pQV7JqymaWIhYIITTNpkVVdK8IGxT0jXMODDty9fDuaAPc8z6c/Qgd1lBsGOiTkE4strToZdr/vTTAvuopVI5/fmginX07tDfdgcwq9gZwLtDU+fDIfN5pxdLYG/g7EAPkgHDl0ddIfmTwA3/Ul3ok/MwDQnvWHQ3Qi8lGDXMBxoNBYEg2/N980d8LPZbP6d3gGvmzt6EAD4LAWYfDO+0//mgtfzeyfeNJnxj5CrU4G/gLWGYbPNZSeDz1OF03k6MKyvb/yJHwz0eiL46zLBXePLdwypNK7++j6F0oId41sDr6nAqSw+3cynAcMCHxjdZYKvUoL3jX3j8leADwzMIUtc40Twn/v7IllBot6n9+bk6kXA72aCQV84GJLmgbhnzAb/FoJ3Nn5C2HWbprcR0sDFO5jEzPdmEvg157EAb2w0gfpj6BAbMEwbG2bzd9igbrOZHdhz3ckOxTXJJGA277ikG2yY3uV783/sne9P4soaxzdkt8OPIohWBAUjnB5xVWDdcCOJm20o1yiJB16ghoQYfaE5Jlzj5ry7f/19ZqYt03ZKp9DCuSd8W0o7lPnM88yvpwg1HQ04nU7rf8HkAM/pw8Nt1NnBe+ntw3TncPsQwJcRgXcAdnloKj16Sx8y2tY7cAzgaujgwx30FwNKo20HuBMRePsSbe9MQdvNAxZ8qXd2IgJfXjYvabXSWm520owwOJ2OBLxz2LucWrzjsHibWvyvnGyAcUiFfhiTLzLjWB2PIebAAdPEkTVHGWfgp/eavY5Z4R5tS9hxgx9xpHGENzVrbOzTMLr2CIDHx1cbmJwBT0cpcwTPJKXY73+k7Ro921yd1vEhA+5j5gseD49My4zJoUlfTllTxhEzNdPoN3U8BUM/3mGWyybu0dNjF1jHoQ0JbN6ZqA5Ph69+YAhCXz0tfhvZDXaB4d24RsFaGtVR8DsEAD/8wAi/iw/udJrb6dlgYHwFd6dqX2lUR7KF/T7d8wF7WowOOn5g8Cm0ZyuqI3Es7JNDBgzp71bjoq75mkr9mwc+POiM+um0HxiCKmCnXvq4eRtxLJTjKyVaYKKadQZ20aN5AekAd9J95OIecMC191TzPcWGk7hnUXO8XY31ygEfHFw+Nztpb4uTBhgqkwwIbDj5AvsvpOV4g19eUtMBhAWniwg2HIsPCFgywTq0rEd8MYrLT7Ml/cQKurwaVx+3RgZ8YKiDOp0Dt3ScyIKBAj0HAHg0sCItrKPZ4KbZmwCcZMDNYvpkJjhhTBLv2D5gvVtxbB+Pk0ckYVZ3qtGG7wA3R2C0EPgI29pk41iS4ytxAQdsjNXkul13gfs6NffEueoHTnCNmPbCTEeEcEwaLQdMIl3j8rnGgE+w1OZJ54QnDD45sYHDmI8N8MEInXhJB25k4E6zWPQEFyk4GQG4iD7b2lPxpMi4GpcpEnARrheatvRREaPpchIdGOdv10lxSi5+/gybaCzmyFmUpYEflgN+cC30aXq8LIsNMt0YFoffjx8EFAl4S0ARgR+Mha68JXSwxFr88KAuzWIGrOuq/rx8sEr8rH9eKljFCxirqm9I39raNWmquUZnsarqeINLgNQR9vvoDfze28K+f33QowGrWIhwd7dUAKsPn0cjtbf1oD7r6tZbDwpA4urwwQBFqvoMm11VB/DnrZ6u99RjMB6Ko/d6bxGBsZqq/ralw4KLoeK2RkpBtKVGB94F8rHaUz1EwV/CEmvx85YOzoYC0Ie1txsNWJ6C4fGmLs1iAP8HW7VrGAgLXp2KBrzLkcqsWBGB1V33gymDGhnYX38fMOJmyE91J5vgPVhmr24wj4GQR3kQF7wnIABXHWDE4yKPAi0ElhJOBnJlz0W7z80kWPAus9oOdh1gKx/k9DNJRshFdZ5MwP+dTDYnz5Nn1sBNWMljk2uxZYAL4U6tWanIAW780icwO+waPPzU6/VG+DHu9SY9Hljn1jSamcqSLVdv7jnsdR4DOMaA+T0F+aROd6dg8OkmI9PTe2ZyJGCTaoD2rCNzBxY7mPU1r9fYUnWzvX/50neBfeUAB5KJddXxnGDEHxp/8F5Bru5UnRvMHyi+kBV52OwCQ13uezL38SpusfdUwQHv7+Pss+SJ7m+aG7osVMde4Mleb9wb78Fg8atn2DeGcQPSYAQZT8abHhYvDCbD03hzigXweDIZYyh+2ozK4j+N+sU+tstIxgJwO3TwvoDW4LDAp/aVC85EZfGpKYt2OpUgGAUCnwpIDOwRZbpTZ4Czc4CRYKhngK8n+73e6fh0gmlkyULYA8MKyEpyg4WjTF6qYfF+Nps93cBEuoK12f0sVHE2ayY5wUbgaA8DUA3VSHjnKA4vysTgrCWTyyQYSQ6wGYGgPq+GnfFtjTz3kQt8ai3WaiUYx3Yw4rcbNDuVKabTYm95gecO9uYE61Y0szB4ww7amAnmhVEg5iuv7v5kS7XAGxQ2XUiSsYs3rlbNRwcbMr0s3mBeELKYpHAvU52VgsH3jePeeANGjPHGFAgJWUgYB3O1gTC6j70ru6PM+/GvMY6vfvU2QFm82cCDFhm+NkyJThI/PGzmuPr+Tyt3XJt0QwtgHOElgmnRAGc3GGVdKVGBLVLWBE63WQo+j8hiH0UAvlmD/47gSj4kSRiciQmIgkPUPwZMbs6RFAJfiILb/uCkhJlSVQ4RfFXyByclK1cBsCYGHgiApyfE5NDAVyXfzOQpWMqEBv7I+YJZ/1Z8GlgyFrtoM/lXZY8Fg/0qrsLsZ3xKKVUzF6xhVYdixgPAWjCwT4OQ5bwWE3J1Cs7zsaIi8wvBrWI5dx6LtQXAt1d5v05SnbaoatvH4KqsVWIi5E+fPgZVYZOlymxPJ6tyRTOgbUxvWwvdsOBbrSJXffIzmpTs17RgWNVKbSF9+oSbl+QzDEMnkaWkX/mgw0ulq9vfhIRvlAU9ig7Gs2cJ3ykimZTyWirIrf2uBuFMjXIpEBfbDDUjNOnNsleuDK5Sge/w96ENXHcdygiJNJVMJZ/Trj5u57in4e3Hx5WnBqa8T/n4SN3OfR/H3+bX+iaYa6211lprrbXWWmuFrBZo+dC6Uo5jKfXCErEFJc5IWRa6ZcMS9FwuLxCJv7VQjrtULgR3mpmNaGUV4lwFIzsKL+IxD24gsruu4nXf95TjC5N5deVrtOLJjSuiXI+3t+ZytLjJhbkKXp4FFvoHjzPqakY91+PxRU1W5nl/azZXqJbncpniAy4vCPYqeSHup9aCYA9nK77gwqLg8nwGLw7mtuzyMsCcLOrxpYCVoF0pLLDL2YoAd+HuxCl9QcRgJRSwEthgoSFTIJt6UIOFJgmRjFoiU0qQKEIUrATqSkIDphjYMqEVD81gMbBpgxJaDQuNf5azhVqWaKwnVms0t3JYfVjcffFyS7SM4sFtXNDZIXalYM5WRD0jLLH2VY6HbLCws0NtWUHaV6gtK5CzQzc4PGcH/zwgHGfXA3MF+2g4g3T4zp7vMx9l+S0rLGfP+yFXYTUGL+7s+T/NXMzZ9U/zq7DsrhSGsxf7+LS1gpYVKCbg1DD+9LW1GmfTqi4roHq9Tj8Ibi3B2Z6VIPhhcD0egZT6UqORgJ+fF+LRSFmNs4U+fFdWZXNUzvYnR+Vs/3G1HBG4vDJn11fVvvwnz/KqarmwKl9H5WxlVeDVtetVNev4qgyOr6g3+TWuyAZrH3ArMq5PP1aiA7dW07J8PB2hwYW/o8Gt8opquP7Pc/SqulJ9NYO03zWM2F8d8CVovY4vSBXBplhvhTFIt1zfX6Ml8SqK4ocN7a8OtCS4KPgKvRXSJepin+8s0LIi+Hqcsvg4//9lcHlJBrccXwwM8U/DAl8NLAeMd+qL2VrnhJtL6EoFXpxrJn7/loxC3747v5HoMPh7Iip9V7iRvWnwt8jA3/iXFGZXSkYGTnLBVmszwLL5o0SZ/1t3mf5wmDzJXj8itv/GlwuediUKrtyZN+y5M37o3B0yeVzHzn+SnRJOzXd51IyU6OZ9wYoDfI//ScxwiO8jRAnV64YklxLtijwYSIlzCcB5rQLgwTkGVzXCiGmlhJzPlWC3faZJ3YFWNV/ig5n+RcE/sbHH5P5FFDy4+FlKnsk/z2P5+4tEo4rB+YZcOju/zuW7yet8FzwjN0rdQfsp14D92NlA6v68MF/yACsusGbW8YCCu9fXw8R9rpGsdMHpBHwxPGuDqwe/57vtp+F1jvi81I1dw3mkOsDV1UaGvsQHs4O0Ac6ZNVMiYPksCWulcZ8Y5gYULJ9JjUypIQ+1fFdukJtIxBryzYUFrhCw8RIXbIt3+OCKlkhctBP37USle6ElbuTKACy+iVW04U0yoyXywyHO/rx7L1UvErk82Ze0jHxjvsQD22YlPjiSfmyf/ucDJ2U5OFgRA8fu7nJeWd48oWZDDgqOi4G15l3XI8t7NMxpMJRowyjA143usWzeLMC8WwE9++mMHj81bC8nZHLPigXB1eP7AcJ99S533TzuytCzc0/oiZx3dofv4yDdNbFT/lfOubw2rkNhfDCMVbkCg2DQnYW7cCCghcaeQDvOZqyFFsrOUMmL0oW67O1sCn3/9Vey08z00jz80HXhahPHSfj5OzqxdD7DSWWeswTONBf5DNmbn0kGgStAZtTGmgBdLgRQUFBWVSZPm8/0KoAR1gwngWYJyShBuWElEjpZChoMAQsTQalDC7b0KKNIAKskAc20LjJAeRvq2p1OgUC5RnCZF3a1AHwAGFEjRAbsigBWzb08FcDOXkjl+mvMAh1YukSIKEO5vUAMDGMGzAeAMZBCuAi3YOXAlhDma7A9X/8GhzRbg+fYjrQDuHjtYcDXi0QeNFkUNqEO7UET6oXFtT1wElBAxlyocTMDDTgGZde/k1sQOc9fl0XUhrQECbHrNJeWIoDhhdbN9ahi7o4kmNvk0rwyetmAbWRUxesOYLcRoGGoX8Ek4+1LQYCS1NicEYAbKl0UQ8WoFrHNqYzWMJbUnUaZm9lwxbQR4eHg2CGz7I+tD9zM5Qo233FzvNkZRm+bc/S/c23f7LXJtQYPW53eBW8dhBbtgdLjgvdu6N8Pb58N/du3HkuY3WB/RdvRHvB4VfieQv+Tryp8X6H/yVcV/q0/+KtPwTvAX7wK3gH2K3g7+JtfwVvBJ6d+BW8F+xa8DTwssw4x6z75sEq/9Ab7F7wFfOpd8MkWxYPGUX/wfzA+DPjzxQ8f4+J4D/izLxc1Ot4NvvC25zrfDf6xzRAta7xUNVZlCnkhChgVdY3mQZCMtMvcBi4RDNMqhAmxx9CWQxWBy6Isl5VvMKxUZYVuwIUtj8s6KXyDOU8VqQnagOMyXZEaKt9gmGKECEHO0omhM1sC7F5RMC7473T0rD4M/PPmLJ4IfPPr7E0UwyIzkr9fqaV8c5hw7ix5UvUHv1xens1+N6TMdMlLyt/PPL05VNQYoGDJeoJv7Hi5vb3lr0WwMst/dd7dApaNGTcIfPPLkp/uGwdjlm+0okK5y0nnpfPDcclxYsERV808OHAAsAWTjLIKlvZ3qYo7gK/suLy9u7t7um8cCPvbSgixQplRJgtxLoW9mJqKDJQWLLRijc/DcCVpYMFKYgVIrREULDocfNWMpztHdukDrDysVCY5ncGAVkxBuNJBXsGQWbD9HGfOe1I5pRlxcxyUUtEioHzWuhddwI8PD61gGJnWi5aqdt4wq2nlfLQFsDOvLDgBJqtQE+rG9ClZyDK+ygsoMt7azYeB/7q+vnbch/t1k1YMagRRSVNMU0jyhZRhJBiiKxgYCw5oDYNqPccNOADc/qho7N4OyXVlwY+PG6zzhjU1VGMYCcpyBVNtjE5gRZmmbo6LnFEZ/gGG0n1kgyzzuBv4+fH+jaGEFnzRnCCVS2eEsbNv04rI2i3KcZW4GMftvTYmMMQ8IHbWpYCdwM/PswPug1LEmO7cC6Qg6QJ+eT5s1UmznK52fkNlnW4gh7tnKDzQkPv+QTd7x76e1e/b3h4dn3/3Mc6PP2wJ838FT1YfT+cITOWBTOb6TOdzDZTc39mbzsuczL0d+Jca4FdP59BP9kxiuqcwkz13GviXGvCkbVh+nQ5Zj7/6k9yrwd8Ykns1+BtDcp8Gf6M0n+jT4G8UyXs3e6eeJHdv8DeS5P3b20H5dTIA7Ely586CY0k+AHziRXLXzoKjSe7YWXA8yR07C44n+R92koOJ2xqEnwAAAABJRU5ErkJggg==') no-repeat left top",
				'-webkit-box-shadow'	: '0px 0px 10px rgba(50, 50, 50, 0.6)',
				'-moz-box-shadow' 		: '0px 0px 10px rgba(50, 50, 50, 0.6)',
				'box-shadow' 			: '0px 0px 10px rgba(50, 50, 50, 0.6)'
			},
			item: {
				'position' 				: 'relative',
				'width' 				: '100%',
				'height' 				: '100%',
				// 'border'				: '1px solid green',

			},
			link: {
				'width' 				: '100%',
				'height' 				: '100%',
				// 'border'				: '1px solid red',
				'text-decoration'		: 'none',
				'display'				: 'block'
			},
			close: {
				none: {
					'display' 			: 'none',
					'width' 			: '16px',
					'height' 			: '16px',
					'position' 			: 'absolute',
					'padding' 			: '0px',
					'top' 				: '2px',
					'right' 			: '2px',
					'cursor' 			: 'pointer',
					'color'				: '#fff',
					'background'		: 'none',
					'z-index' 			: '1px'
				},
				normal: {
					'text-align' 		: 'center',
					'color'				: '#fff'
				},
				hover: {
					'color'				: '#000',
					'border'			: '1px solid #000'
				}
			}
		},
		t = {},
		self = this;

		try {

			t.wrap 		= $('<div/>', {  'id': object.name + '-wrap', 'css': css.wrap });
			t.item 		= $('<div/>', { 'css': css.item });
			t.close 	= $('<div/>', { 'css': css.close.none, 'html': self.svg.close(css.close.none) });
			t.link 		= $('<a/>', { href: object.item.url, target: '_blank', 'css': css.link });

			t.item.appendTo(t.wrap);
			t.close.appendTo(t.item);
			t.link.appendTo(t.item);
			t.wrap.appendTo(object.append);

			t.wrap.delay(object.item.delay)
				.fadeIn(object.item.effects.duration, object.item.effects.easing[0]);

			t.link.mouseover(function() {
				if (t.close.is(':visible') === false)
					return t.close.delay(object.item.effects.duration).fadeIn(600);
			});

			t.close.click(function() {
				t.wrap.fadeOut((object.item.effects.duration/2), object.item.effects.easing[1], function() {
					self.setStore(object.closePoint, [true, object.date.now()]);
					t.wrap.remove();
				});
			});

			t.link.on('auxclick touchstart click', function() {
				return self.clickAdvert(object);
			});

		} catch (e) {
			return console.error(e);
		} finally {
			return self.notice(object);
		}
	};

})(jQuery);
