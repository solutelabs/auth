import { BadRequestException, CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";

@Injectable()
export class RolesGuard implements CanActivate{
    constructor(private reflector: Reflector){}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const roles = this.reflector.get<string[]>('roles',context.getHandler());
        let authorized = true;
        if(!roles)
        return authorized;
        const { user } = context.switchToHttp().getRequest();
        //console.log(user,'user')
        authorized = roles.includes(user.role)
        if(!authorized)
        throw new BadRequestException('You are not authorized to access')
        else return authorized
    }
}