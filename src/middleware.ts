import { MiddlewareConfig, NextRequest, NextResponse } from "next/server"
import { jwtDecode } from "jwt-decode"
import { User } from "./context/AuthContext"

const publicRoutes = [
    { path: '/login', whenAuthenticated: 'redirect'},
] as const

const privateRoutes = [
    {path: '/dashboard/user/', role: 'admin, user'},
    {path: '/dashboard/admin', role: 'admin'},
    {path: '/booking/', role: 'admin, photo'}
] as const

const REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE = '/login'

export function middleware(request: NextRequest){
    const path = request.nextUrl.pathname
    const publicRoute = publicRoutes.find(route => path.includes(route.path))
    const authToken = request.cookies.get('token')?.value

    if(!authToken && publicRoute){
        return NextResponse.next()
    }
    if(!authToken && !publicRoute){
        const redirectUrl = request.nextUrl.clone()

        redirectUrl.pathname = REDIRECT_WHEN_NOT_AUTHENTICATED_ROUTE

        return NextResponse.redirect(redirectUrl)
    }
    if(authToken && publicRoute && publicRoute.whenAuthenticated === 'redirect'){
        const decoded: User = jwtDecode(authToken)
        const {role, userId} = decoded
        const redirectUrl = request.nextUrl.clone()

        if(role === 'admin'){
            redirectUrl.pathname = '/dashboard/admin'
            return NextResponse.redirect(redirectUrl)
        }
        if(role === 'user'){
            redirectUrl.pathname = `/dashboard/user/${userId}`
            return NextResponse.redirect(redirectUrl)
        }
        if(role === 'photo'){
            redirectUrl.pathname = `/booking/list`
            return NextResponse.redirect(redirectUrl)
        }
    }
    if(authToken && !publicRoute){
        const decoded: User = jwtDecode(authToken)
        const {role, userId} = decoded

        const privateRoute = privateRoutes.find(route => path.includes(route.path))
        if(privateRoute?.role.includes(role)){
            return NextResponse.next()
        } else {
            if(role === 'user'){
                const redirectUser = request.nextUrl.clone()
                redirectUser.pathname = `/dashboard/user/${userId}`
                return NextResponse.next()
            }
            if(role === 'photo'){
                const redirectPhoto = request.nextUrl.clone()
                redirectPhoto.pathname = `/booking/list`
                return NextResponse.next()
            }
        }
    }
}

export const config: MiddlewareConfig = {
    matcher: [
        /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)',
    ]
}